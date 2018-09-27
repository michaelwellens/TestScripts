#!/usr/bin/env python2

#Importing packages
import requests
import cv2
import os
import json
import argparse
import time
import glob
import shutil


# Read Parser
parser = argparse.ArgumentParser(description='Classification - DIGITS')

#parser.add_argument('image_file',
#                    nargs='+',
#                    help='Path[s] to an image')

#args = vars(parser.parse_args())


image_list = glob.glob("/media/airobot/EXTERNEWIN/Corda_Car_overhead_Photo/Fractured/*")
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
        'job_id': (None, '20180921-085440-9d21'),
        'image_file': (inputimage, open(inputimage, 'rb')),
        'dont_resize': (None, 'true'),
    }

    response = requests.post('http://localhost:5000/models/images/generic/infer_one.json', files=files)
    detections = response.json()
    detections = detections[u'outputs'][u'bbox-list']
    #print(detections)

    # Getting the file name
    file_name = os.path.basename(str(inputimage))  # file_name must be a string
    file_name = file_name.replace("[", "")          # Function to remove characters from string 
    file_name = file_name.replace("]", "")  
    file_name = file_name.replace("'", "")
    file_name_no_extension = file_name.replace(".jpg","")
    print(file_name)

    # Check if the list is full of zeros (no detection)
    if all(all(all(y == 0 for y in x) for x in v)  for v in detections):
        shutil.move(inputimage, "/home/airobot/void/"+file_name)
        print("File moved to void")
    else:
        img = cv2.imread(inputimage)
        #img = cv2.resize(img, (1248, 384))




        # Tekst file handeling w is writing and + is create file
        labelfile = open(file_name_no_extension+".txt", "w+")



        for images_result in detections:
        #for images_result in detections.itervalues():
            #print '==> Image #%d' % i
            for left, top, right, bottom, confidence in images_result:
                #print(images_result)

                if confidence == 0:
                    continue
                        
                    
                cv2.rectangle(img,(int(left),int(top)),(int(right),int(bottom)),(0,0,255),2)
            
                    
                """print 'Detected object at [(%d, %d), (%d, %d)] with "confidence" %f' % (
                    int(round(left)),
                    int(round(top)),
                    int(round(right)),
                    int(round(bottom)),
                    confidence,
                )"""

                labelfile.write("Car"+' '+"0.0"+' '+"0"+' '+"0.0"+' '+"%d"%(int(round(left)))+' '+"%d"%(int(round(top)))+' '+"%d"%(int(round(right)))+' '+"%d"%(int(round(bottom)))+' '+"0.0"+' '+"0.0"+' '+"0.0"+' '+"0.0"+' '+"0.0"+' '+"0.0"+' '+"0.0\n")



    # If we want to write the result to an image
    #os.path.join(dirname,filename) is a function to give a path to a filename
    #cv2.imwrite(os.path.join('/home/airobot/Pictures/', file_name), img)

