
import tensorrt as trt

import pycuda.driver as cuda
import pycuda.autoinit
import numpy as np

from tensorrt import parsers
import cv2

G_LOGGER = trt.infer.ConsoleLogger(trt.infer.LogSeverity.ERROR)

INPUT_LAYERS = ['data']
OUTPUT_LAYERS = ['prob']
INPUT_H = 28
INPUT_W =  28
OUTPUT_SIZE = 10

MODEL_PROTOTXT = 'deploy.prototxt'
CAFFE_MODEL = 'snapshot_iter_102000.caffemodel'
#DATA = './data/mnist/'
#IMAGE_MEAN = './data/mnist/mnist_mean.binaryproto'

""" Building engine """
engine = trt.utils.caffe_to_trt_engine(G_LOGGER,MODEL_PROTOTXT,CAFFE_MODEL,1,1 << 20,OUTPUT_LAYERS,trt.infer.DataType.FLOAT)



"""
parser = parsers.caffeparser.create_caffe_parser()
mean_blob = parser.parse_binary_proto(IMAGE_MEAN)
parser.destroy()
#NOTE: This is different than the C++ API, you must provide the size of the data
mean = mean_blob.get_data(INPUT_W ** 2)
data = np.empty([INPUT_W ** 2])
for i in range(INPUT_W ** 2):
    data[i] = float(img[i]) - mean[i]
mean_blob.destroy() """

""" Reading Input Image """
im = cv2.imread("/media/airobot/Externe/Test_Scripts/Python_Scripts/TensorRT/273image.jpg")

cv2.imshow(np.asarray(im))
arr = np.array(im)
img = arr.ravel()

""" Create Runtime """
runtime = trt.infer.create_infer_runtime(G_LOGGER)
context = engine.create_execution_context()

""" allocate empty array on cpu to store the result """
assert(engine.get_nb_bindings() == 2)
#convert input data to Float32
img = img.astype(np.float32)
#create output array to receive data
output = np.empty(OUTPUT_SIZE, dtype = np.float32)

""" allocating memory on the gpu """
d_input = cuda.mem_alloc(1 * img.size * img.dtype.itemsize)
d_output = cuda.mem_alloc(1 * output.size * output.dtype.itemsize)

""" Convert alocation to int"""
bindings = [int(d_input), int(d_output)]

stream = cuda.Stream()


#transfer input data to device
cuda.memcpy_htod_async(d_input, img, stream)
#execute model
context.enqueue(1, bindings, stream.handle, None)
#transfer predictions back
cuda.memcpy_dtoh_async(output, d_output, stream)
#syncronize threads
stream.synchronize()

print ("Prediction: " + str(np.argmax(output)))

context.destroy()
engine.destroy()

runtime.destroy()