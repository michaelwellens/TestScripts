# import the necessary packages
import numpy as np
import argparse
import imutils
import cv2
import os
import time

from imutils.video import VideoStream
from random import randint
from google.protobuf import text_format


import scipy.misc
os.environ['GLOG_minloglevel'] = '2' # Suppress most caffe output

import caffe
from caffe.proto import caffe_pb2

# Initialize the tracker
multiTracker = None
# Specify the tracker type
trackerType = "CSRT"   

# initialize trigger time
trigger_time = time.time()

## Select boxes
bboxes = []
colors = []



trackerTypes = ['BOOSTING', 'MIL', 'KCF','TLD', 'MEDIANFLOW', 'GOTURN', 'MOSSE', 'CSRT']
 
def createTrackerByName(trackerType):
  # Create a tracker based on tracker name
  if trackerType == trackerTypes[0]:
    tracker = cv2.TrackerBoosting_create()
  elif trackerType == trackerTypes[1]: 
    tracker = cv2.TrackerMIL_create()
  elif trackerType == trackerTypes[2]:
    tracker = cv2.TrackerKCF_create()
  elif trackerType == trackerTypes[3]:
    tracker = cv2.TrackerTLD_create()
  elif trackerType == trackerTypes[4]:
    tracker = cv2.TrackerMedianFlow_create()
  elif trackerType == trackerTypes[5]:
    tracker = cv2.TrackerGOTURN_create()
  elif trackerType == trackerTypes[6]:
    tracker = cv2.TrackerMOSSE_create()
  elif trackerType == trackerTypes[7]:
    tracker = cv2.TrackerCSRT_create()
  else:
    tracker = None
    print('Incorrect tracker name')
    print('Available trackers are:')
    for t in trackerTypes:
      print(t)
     
  return tracker


def open_cam_usb(dev, width, height):
    # We want to set width and height here, otherwise we could just do:
    #     return cv2.VideoCapture(dev)
    gst_str = ("v4l2src device=/dev/video{} ! "
               "video/x-raw, width=(int){}, height=(int){}, format=(string)RGB ! "
               "videoconvert ! appsink").format(dev, width, height)

    #gst_str = ("nvcamerasrc queue-size=10 sensor-id={} fpsRange='60 60' ! video/x-raw, width=(int){}, height=(int){}, format=(string)RGB ! videoconvert ! appsink").format(dev, width, height)

    print("Stream started")
    cap = cv2.VideoCapture(gst_str, cv2.CAP_GSTREAMER)
    print(cap)
    return cap

def get_net(caffemodel, deploy_file, use_gpu=True):
    """
    Returns an instance of caffe.Net
    Arguments:
    caffemodel -- path to a .caffemodel file
    deploy_file -- path to a .prototxt file
    Keyword arguments:
    use_gpu -- if True, use the GPU for inference
    """
    if use_gpu:
        caffe.set_mode_gpu()
        print("GPU mode")

    # load a new model
    return caffe.Net(deploy_file, caffemodel, caffe.TEST)

def get_transformer(deploy_file, mean_file=None):
    """
    Returns an instance of caffe.io.Transformer
    Arguments:
    deploy_file -- path to a .prototxt file
    Keyword arguments:
    mean_file -- path to a .binaryproto file (optional)
    """
    network = caffe_pb2.NetParameter()
    with open(deploy_file) as infile:
        text_format.Merge(infile.read(), network)

    if network.input_shape:
        dims = network.input_shape[0].dim
    else:
        dims = network.input_dim[:4]

    t = caffe.io.Transformer(
            inputs = {'data': dims}
            )
    t.set_transpose('data', (2,0,1)) # transpose to (channels, height, width)

    # color images
    if dims[1] == 3:
        # channel swap
        t.set_channel_swap('data', (2,1,0))

    if mean_file:
        # set mean pixel
        with open(mean_file,'rb') as infile:
            blob = caffe_pb2.BlobProto()
            blob.MergeFromString(infile.read())
            if blob.HasField('shape'):
                blob_dims = blob.shape
                assert len(blob_dims) == 4, 'Shape should have 4 dimensions - shape is "%s"' % blob.shape
            elif blob.HasField('num') and blob.HasField('channels') and \
                    blob.HasField('height') and blob.HasField('width'):
                blob_dims = (blob.num, blob.channels, blob.height, blob.width)
            else:
                raise ValueError('blob does not provide shape or 4d dimensions')
            pixel = np.reshape(blob.data, blob_dims[1:]).mean(1).mean(1)
            t.set_mean('data', pixel)

    return t

def resize_img(image, height, width):
    """
    Resizes the image to detectnet inputs
    Arguments:
    image -- a single image
    height -- height of the network input
    width -- width of the network input
    """
    #print(image)
    image = np.array(image)
    
    image = scipy.misc.imresize(image, (height, width), 'bilinear')
    return image

def draw_bboxes(image, locations):
    """
    Draws the bounding boxes into an image
    Arguments:
    image -- a single image already resized
    locations -- the location of the bounding boxes
    """
    #print(locations)
    for left,top,right,bottom,confidence in locations:
        if confidence==0:
            continue
        cv2.rectangle(image,(left,top),(right,bottom),(255,0,0),3)

    #cv2.imwrite('bbox.png',image)#test on a single image
    return image, locations

def forward_pass(image, net, transformer, batch_size=None):
    """
    Returns scores for each image as an np.ndarray (nImages x nClasses)
    Arguments:
    image -- a list of np.ndarrays
    net -- a caffe.Net
    transformer -- a caffe.io.Transformer
    Keyword arguments:
    batch_size -- how many images can be processed at once
        (a high value may result in out-of-memory errors)
    """
    if batch_size is None:
        batch_size = 1

    caffe_images = []

    if image.ndim == 2:
        caffe_images.append(image[:,:,np.newaxis])
    else:
        caffe_images.append(image)

    dims = transformer.inputs['data'][1:]

    scores = None
    for chunk in [caffe_images[x:x+batch_size] for x in xrange(0, len(caffe_images), batch_size)]:
        new_shape = (len(chunk),) + tuple(dims)
        if net.blobs['data'].data.shape != new_shape:
            net.blobs['data'].reshape(*new_shape)
        for index, image in enumerate(chunk):
            image_data = transformer.preprocess('data', image)
            net.blobs['data'].data[index] = image_data
        start = time.time()
        output = net.forward()[net.outputs[-1]]
        end = time.time()
        if scores is None:
            scores = np.copy(output)
        else:
            scores = np.vstack((scores, output))
        #print 'Processed %s/%s images in %f seconds ...' % (len(scores), len(caffe_images), (end - start))

    return scores

def classify(caffemodel, deploy_file, image,
        mean_file=None, batch_size=None, use_gpu=True):
    """
    Classify some images against a Caffe model and print the results
    Arguments:
    caffemodel -- path to a .caffemodel
    deploy_file -- path to a .prototxt
    image_files -- list of paths to images
    Keyword arguments:
    mean_file -- path to a .binaryproto
    use_gpu -- if True, run inference on the GPU
    """

    transformer = get_transformer(deploy_file, mean_file)
    _, channels, height, width = transformer.inputs['data']
    if channels == 3:
        mode = 'RGB'
    elif channels == 1:
        mode = 'L'
    else:
        raise ValueError('Invalid number for channels: %s' % channels)

    #image = resize_img(image,height,width)
    image = resize_img(image,480,480)

    # Classify the image
    scores = forward_pass(image, net, transformer, batch_size=batch_size)

    ### Process the results
    
    # Format of scores is [ batch_size x max_bbox_per_image x 5 (xl, yt, xr, yb, confidence) ]
    # https://github.com/NVIDIA/caffe/blob/v0.15.13/python/caffe/layers/detectnet/clustering.py#L81
    for i, image_results in enumerate(scores):
        #print '==> Image #%d' % i
        img_result, locations = draw_bboxes(image,image_results)
    # This line is optinal, in this case we resize to the size of the original input video, can be removed
    #img_result = resize_img(img_result,480,640)
    return img_result, locations
    

if __name__ == '__main__':
    global args
    script_start_time = time.time()

    
    parser = argparse.ArgumentParser(description='DetectNet - DIGITS')

    ### Positional arguments

    parser.add_argument('caffemodel',   help='Path to a .caffemodel')
    parser.add_argument('deploy_file',  help='Path to the deploy file')
    parser.add_argument('video_device',   help='Which video device to use')
    

    ### Optional arguments

    parser.add_argument('-m', '--mean',
            help='Path to a mean file (*.npy)')
    parser.add_argument('--batch-size',
                        type=int)
    parser.add_argument('--nogpu',
            action='store_true',
            help="Don't use the GPU")
 
    args = vars(parser.parse_args())

    # Load the model
    net = get_net(args["caffemodel"], args["deploy_file"], True)
    print("NET LOADED")

    # Get the device to stream from
    videoSource = args["video_device"]
    videoSource = int(videoSource)
    #vs = VideoStream(src=videoSource).start()
    #time.sleep(2.0)

    cap = open_cam_usb(videoSource,800,600)
    while True:
        #frame = vs.read()
        streamstatus, frame = cap.read()
        #print(frame)

        # resize the frame for faster processing and then convert the
        # frame from BGR to RGB ordering (dlib needs RGB ordering)
        frame = imutils.resize(frame, width=480)
        #rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        #print(tracker)
        print(abs(time.time() - trigger_time))
        print(multiTracker)
        if multiTracker is None:
            print("not tracking")
            frame, locations = classify(args["caffemodel"],args["deploy_file"],frame)
            
            #left = locations[0,0]
            #top = locations[0,1]
            #right = locations[0,2]
            #bottom = locations[0,3]
            #confidence = locations[0,4]
            #print(locations)
            
            for left,top,right,bottom,confidence in locations:
            
                # construct a dlib rectangle object from the bounding
                # box coordinates and then start the dlib correlation
                # tracker
                bbox = (left,top,right,bottom)
            
                if confidence >= 0.1:
                    bboxes.append(bbox)
                    colors.append((randint(0, 255), randint(0, 255), randint(0, 255)))
            

            
            # Create MultiTracker object
            multiTracker = cv2.MultiTracker_create()

            print(bboxes)
            # Initialize MultiTracker 
            for bbox in bboxes:
                multiTracker.add(createTrackerByName(trackerType), frame, bbox)


         




        # otherwise, we've already performed detection so let's track
	    # the object
	    
        else:
            print("tracking")
            # get updated location of objects in subsequent frames
            success, boxes = multiTracker.update(frame)
            # draw tracked objects
            print(boxes)
            for i, newbox in enumerate(boxes):
                p1 = (int(newbox[0]), int(newbox[1]))
                p2 = (int(newbox[0] + newbox[2]), int(newbox[1] + newbox[3]))
                print(colors)
                cv2.rectangle(frame, p1, p2, colors[i], 2, 1)

            # Update every 2 sec for reliable detections
            if(abs(time.time() - trigger_time) >= 2):
                print("update tracking")
                frame, locations = classify(args["caffemodel"],args["deploy_file"],frame)
                trigger_time = time.time()
                #left = locations[0,0]
                #top = locations[0,1]
                #right = locations[0,2]
                #bottom = locations[0,3]
                #confidence = locations[0,4]
                #print(locations)
            
                for left,top,right,bottom,confidence in locations:
                
                    # construct a dlib rectangle object from the bounding
                    # box coordinates and then start the dlib correlation
                    # tracker
                    bbox = (left,top,right,bottom)
                    if confidence >= 0.1:
                        bboxes.append(bbox)
                        colors.append((randint(0, 255), randint(0, 255), randint(0, 255)))
                
                
                # Initialize MultiTracker 
                for bbox in bboxes:
                    multiTracker.add(createTrackerByName(trackerType), frame, bbox)
                        

            

        cv2.imshow("Car Detection", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    frame.release()
    #vs.stop()



print 'Video took %f seconds.' % (time.time() - script_start_time)



