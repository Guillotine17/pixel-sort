from sys import modules
import tkinter as tk
from cv2 import destroyAllWindows

class SortApp():
    window: tk.Tk
    modules = []
    
    def close(self):
        self.window.destroy()
        destroyAllWindows()
    def __init__(self):
        self.closed = False
        self.window = tk.Tk()
        label = tk.Label(self.window, text='sorter')
        label.pack()
        self.modules = []
        tk.Button(self.window, text= "Close", font=('Poppins bold', 16), command=lambda :(self.close())).pack(pady=20)

    def register_module(self, module):
        self.modules.append(module)

    def run(self):
        while True:
            if self.closed:
                return
            for module in self.modules:
                module.update()
            self.window.update_idletasks()
            self.window.update()