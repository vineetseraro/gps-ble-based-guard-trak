package io.akwa.traquer.guardtrack.common.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;


public class ImageRotationManagement {

    public static Bitmap decodeImageFile(String file) {
        try {
            return decodeImageFile(new File(file));
        } catch (Exception e) {

        }
        return null;
    }

    public static Bitmap setOrientation(String path) {
            BitmapFactory.Options bounds = new BitmapFactory.Options();
            bounds.inJustDecodeBounds = true;
            return BitmapFactory.decodeFile(path);

    }

    public static Bitmap decodeImageFile(File file) {
        Bitmap bitmapToReturn = null;
        try {
            if (file != null) {
                if (file.exists()) {
                    FileInputStream fis = new FileInputStream(file);
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();

                    final int buffer_size = StringUtils.BUFFER_SIZE;
                    try {
                        byte[] bytes = new byte[buffer_size];
                        for (; ; ) {
                            int count = fis.read(bytes, 0, buffer_size);
                            if (count == -1)
                                break;
                            baos.write(bytes, 0, count);
                        }
                        bytes = baos.toByteArray();
                        baos.close();
                        fis.close();

                        BitmapFactory.Options opt = new BitmapFactory.Options();
                        opt.inPurgeable = true;

                        bitmapToReturn = BitmapFactory.decodeByteArray(bytes,
                                0, bytes.length, opt);
                        bytes = null;
                    } catch (Exception e) {

                    }
                }
            }
        } catch (Exception e) {

        }
        System.gc();
        return bitmapToReturn;
    }

    public static int calculateInSampleSize(
            BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {

            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) > reqHeight
                    && (halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }

        return inSampleSize;
    }

    public static Bitmap decodeSampledBitmapFromFile(String path,
                                                         int reqWidth, int reqHeight) {

        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(path, options);
        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        Bitmap bitmap= BitmapFactory.decodeFile(path,options);

        int rotate = 0;
        try {
            File imageFile = new File(path);
            ExifInterface exif = new ExifInterface(
                    imageFile.getAbsolutePath());
            int orientation = exif.getAttributeInt(
                    ExifInterface.TAG_ORIENTATION,
                    ExifInterface.ORIENTATION_NORMAL);

            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_270:
                    rotate = 270;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    rotate = 180;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_90:
                    rotate = 90;
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Matrix matrix = new Matrix();
        matrix.postRotate(rotate);
        return Bitmap.createBitmap(bitmap , 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    }
}