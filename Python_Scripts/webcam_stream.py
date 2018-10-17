import cv2
import time
from imutils.video import VideoStream


vs = VideoStream(src=0,usePiCamera=False,resolution=(1240,720)).start()
time.sleep(2.0)

while True:
    frame = vs.read()

    cv2.imshow("Frame",frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


print("Finished")

