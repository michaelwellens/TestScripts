#!/usr/bin/env python2

#Importing packages
import requests
import cv2
import os
import json
import argparse
import time
import glob


# Read Parser
parser = argparse.ArgumentParser(description='Classification - DIGITS')

#parser.add_argument('image_file',
#                    nargs='+',
#                    help='Path[s] to an image')

#args = vars(parser.parse_args())


image_list = glob.glob("/home/airobot/Pictures/*")
#print(image_list)


# Loop over list
for i in range(len(image_list)):
    #print(image_list[i])
    #print(i)
    inputimage = image_list[i]
    #print(inputimage)

    




#varaibles
#inputimage = []
#inputimage = args['image_file']
#inputimage = inputimage[0]
#print(inputimage)

    files = {
        'job_id': (None, '20180307-181031-2469'),
        'image_file': (inputimage, open(inputimage, 'rb')),
        'dont_resize': (None, 'true'),
    }

    response = requests.post('http://localhost:5000/models/images/generic/infer_one.json', files=files)
    detections = response.json()
    detections = detections[u'outputs'][u'bbox-list']
    print(detections)


    img = cv2.imread(inputimage)
    #img = cv2.resize(img, (1248, 384))



    for images_result in detections:
    #for images_result in detections.itervalues():
            #print '==> Image #%d' % i
            for left, top, right, bottom, confidence in images_result:
                if confidence == 0:
                    continue
                    
                cv2.rectangle(img,(int(left),int(top)),(int(right),int(bottom)),(0,0,255),2)
        
                
                print 'Detected object at [(%d, %d), (%d, %d)] with "confidence" %f' % (
                    int(round(left)),
                    int(round(top)),
                    int(round(right)),
                    int(round(bottom)),
                    confidence,
                )

    # Getting the file name
    file_name = os.path.basename(str(inputimage))  # file_name must be a string
    file_name = file_name.replace("[", "")          # Function to remove characters from string 
    file_name = file_name.replace("]", "")  
    file_name = file_name.replace("'", "")
    print(file_name)
    #os.path.join(dirname,filename) is a function to give a path to a filename
    cv2.imwrite(os.path.join('/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/back_end/public/images_to_upload/', file_name), img)
