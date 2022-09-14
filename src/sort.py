#!/c/Users/bryan/.virtualenvs/pixelsorter-nq_cZ9XP/Scripts/python

# activate virtual environment with `pipenv shell`
import argparse
import os
from app import SortApp
from sortFunctions import SortFunctions
from modules.sort_module import SortModule
from video_capture import VideoCapture
import tkinter as tk
args = None

def parseArgs():
    parser = argparse.ArgumentParser(description='scroll around the image, get stuff out of it put stuff back in')
    parser.add_argument('-i', type=str, help='path to the input image', dest='inputImage', default="./cat.png")
    parser.add_argument('-o', type=str, help='path to the output image', dest='outputPath', default="./output.png")
    return parser.parse_args()




def getEdgesCallable(count):
    # return ((lum > 1 / 6) & (lum < 2 / 6)) | ((lum > 3 / 6) & (lum < 4 / 6)) | ((lum > 5 / 6) & (lum < 6 / 6))
    def getEdges(lum):
        retVal = None
        for maybeEdge in [((lum > i/count) & (lum < i+1/count)) for i in range(1, count+1, 2)]:
            if retVal is None:
                retVal = maybeEdge
            else:
                retVal = retVal & maybeEdge
        return retVal
    return getEdges
    
def main(event = None):
    args = parseArgs()
    inputImage = args.inputImage
    outputPath = args.outputPath
    if not os.path.isfile(inputImage):
        print(f'Input Image does not exist: {inputImage}')
        return 
    import cv2

    cap = cv2.VideoCapture(0)

    # Check if the webcam is opened correctly
    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    while True:
        ret, frame = cap.read()
        frame = cv2.resize(frame, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)


        c = cv2.waitKey(1)
        if c == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    app = SortApp()

    video_capture = VideoCapture(video_source=0)

    SortModule(app, video_capture)
    app.run()
