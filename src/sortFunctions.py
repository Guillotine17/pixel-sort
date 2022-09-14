import numpy as np
from scipy.signal import convolve2d

class SortFunctions():
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
    # def laplace(self, pixels):
    #     from scipy.signal import convolve2d
    #     return np.abs(convolve2d(self.lum(pixels), np.array([[0, -1, 0],
    #                                             [-1, 4, -1],
    #                                             [0, -1, 0]]), 'same'))