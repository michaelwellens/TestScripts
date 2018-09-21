# This folder contains basic image processing tools

## cross_corrolation_scipy_function.py

This script is to measure the pixel offset of two images. It uses the function

	scipy.signal.fftconvolve(img1_gray, img2_gray[::-1,::-1], mode='same')

and then uses

	np.unravel_index(np.argmax(corr_img), corr_img.shape)

to convert it to (y,x) pixel coordinates.

## plot_register_translation_skimage.py

This script is to measure the pixel offset of two pixels. It uses the funcion

	shift, error, diffphase = register_translation(image, offset_image)

This a function of Skimage package. Make sure you heva the 0.14 version.
the varialbe shift wil contain the [y,x] offset pixel coordinates.

