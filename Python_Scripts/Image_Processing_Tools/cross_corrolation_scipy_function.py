import numpy as np
import scipy.signal

def cross_image(img1, img2):
    """
    Function to get the pixel shift of img2 relative to img1self.
    Images must be of the same size.
    Arguments:
    im1 -- path to image 1 (reference image)
    im2 -- path to image 2 
    """
    # get rid of the color channels by performing a grayscale transform
    # the type cast into 'float' is to avoid overflows
    img1_gray = np.sum(img1.astype('float'), axis=2)
    img2_gray = np.sum(img2.astype('float'), axis=2)

    # get rid of the averages, otherwise the results are not good
    img1_gray -= np.mean(img1_gray)
    img2_gray -= np.mean(img2_gray)

    # calculate the correlation image; note the flipping of onw of the images
    corr_img = scipy.signal.fftconvolve(img1_gray, img2_gray[::-1,::-1], mode='same')
    
    return np.unravel_index(np.argmax(corr_img), corr_img.shape)