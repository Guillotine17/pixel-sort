# https://www.reddit.com/r/pixelsorting/comments/dewpt6/pixel_sorting_in_20_lines_of_python_using_numpy/

import tkinter as tk
import numpy as np
from scipy.signal import convolve2d
from PIL import Image, ImageTk
import cv2
from video_capture import VideoCapture
from app import SortApp
from typing import Callable
def lum(pixels):
    return np.average(pixels, axis=2)/255
def hue(pixels):
    r, g, b = np.split(pixels, 3, 2)
    return np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)[:, :, 0]
def saturation(pixels):
    r, g, b = np.split(pixels, 3, 2)
    maximum = np.maximum(r, np.maximum(g, b))
    minimum = np.minimum(r, np.minimum(g, b))
    return ((maximum - minimum) / maximum)[:, :, 0]
def laplace(self, pixels):
    return np.abs(convolve2d(lum(pixels), np.array([[0, -1, 0],
                                            [-1, 4, -1],
                                            [0, -1, 0]]), 'same'))
SORT_FUNCTIONS= {
    'LUM': lum,
    'HUE': hue,
    'LAPLACE': laplace,
    'SATURATION': saturation
}

def sort_pixels(image: Image, value: Callable, condition: Callable, rotation: int = 0):
    pixels = np.rot90(np.array(image), rotation)
    values = value(pixels)
    edges = np.apply_along_axis(lambda row: np.convolve(row, [-1, 1], 'same'), 0, condition(values))
    # return Image.fromarray(np.rot90(edges, - rotation), mode="L")
    intervals = [np.flatnonzero(row) for row in edges]

    for row, key in enumerate(values):
        order = np.split(key, intervals[row])
        for index, interval in enumerate(order[1:]):
            order[index + 1] = np.argsort(interval) + intervals[row][index]
        order[0] = range(order[0].size)
        order = np.concatenate(order)

        for channel in range(3):
            pixels[row, :, channel] = pixels[row, order.astype('uint32'), channel]

    return np.rot90(pixels, -rotation)

def getSortedFrame(pixels, sort_type: str='LUM'):
    return sort_pixels(pixels,
        value=SORT_FUNCTIONS[sort_type],
        condition=lambda lum: ((lum > 2 / 6) & (lum < 4 / 6)),
        rotation=1
        )


class SortModule():
    def __init__(self, app:SortApp, video_capture: VideoCapture) -> None:
        self.sort_type = 'HUE'
        self.app = app
        app.register_module(self)
        self.register_input(video_capture)
        
        # self.canvas:tk.Canvas = tk.Canvas(
        #     master=app.window, 
        #     width=self.video_capture.width,
        #     height=self.video_capture.height
        # )
        # self.canvas.pack()
        self.panel = tk.Label(master=app.window)
        self.panel.pack()
    def register_input(self, video_capture: VideoCapture):
        self.video_capture = video_capture
    def update(self):
        self.photo = ImageTk.PhotoImage(image = Image.fromarray(cv2.cvtColor(getSortedFrame(self.video_capture.getFrame()[1]), cv2.COLOR_BGR2RGB)))
        # self.canvas.create_image(
        #     0, 0,
        #     image=self.photo,
        #     anchor = tk.NW
        # )
        self.panel.configure(image=self.photo)
