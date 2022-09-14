import cv2


class VideoCapture():
    def __init__(self, video_source = 0):
        self.cap:cv2.VideoCapture = cv2.VideoCapture(video_source)
        if not self.cap.isOpened():
            raise IOError("Cannot open webcam")
        self.height = self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        self.width = self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    def getFrame(self):
        ret, frame = self.cap.read()
        if ret:
            return (ret, cv2.resize(frame, None, fx=1, fy=1, interpolation=cv2.INTER_AREA))
        else:
            return (ret, None)
    def __del__(self):
        self.cap.release()
        cv2.destroyAllWindows()

