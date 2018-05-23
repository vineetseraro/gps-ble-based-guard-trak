package io.akwa.traquer.guardtrack.common.utils;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;



import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import id.zelory.compressor.Compressor;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.crop.Crop;

public class CropImageUtil extends PhotoUtility implements BaseActivity.CheckWriteExternalStorage, BaseActivity.CheckReadExternalStorage {
    private static final String PATH = Environment.getExternalStorageDirectory() + "/" + StringUtils.APP_NAME + "/Images";
    private Activity mContext;
    private File mCameraImageFile, mCompressedImageFile;
    private File mCameraStorageDirectory;
    private File mCameraStorageFile;
    private final String directoryName = "/PvrCinema";
    private final String fileName = "/image_";
    public static int sFileCounter = 0;
    private PhotoUtility.OnImageSelectListener mOnImageSelectListener;
    String imagePath;
    Uri cameraPickUri;

    public CropImageUtil(Activity pContext, PhotoUtility.OnImageSelectListener imageSelectListener) {
        super(pContext, imageSelectListener);
        mContext = pContext;
        mOnImageSelectListener = imageSelectListener;
    }

    public interface OnRemoveImageSelectListener {
        void onRemoveImageSelected(boolean isRemove);
    }

    public void selectImage(final OnRemoveImageSelectListener onRemoveImageSelectListener) {
        final CharSequence[] items = {"Remove photo", "Take a photo", "Choose a photo", "Cancel"};
        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        builder.setTitle("Upload a photo");
        builder.setCancelable(false);
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int item) {

                if (items[item].equals("Take a photo")) {
                    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    createDirectory();
                    cameraPickUri = Uri.fromFile(mCameraStorageFile);
                    intent.putExtra(MediaStore.EXTRA_OUTPUT, cameraPickUri);
                    mContext.startActivityForResult(intent, StringUtils.REQUEST_CAMERA);
                } else if (items[item].equals("Choose a photo")) {
                    Intent intent = new Intent(
                            Intent.ACTION_PICK,
                            MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                    createDirectory();
                    intent.setType("image/*");
                    mContext.startActivityForResult(
                            Intent.createChooser(intent, "Select File"),
                            StringUtils.REQUEST_SELECT_FILE);
                } else if (items[item].equals("Remove photo")) {
                    onRemoveImageSelectListener.onRemoveImageSelected(true);
                    dialog.dismiss();
                } else {
                    dialog.dismiss();
                }
            }
        });
        builder.show();
    }


    public void onTakePhoto() {
        ((BaseActivity) mContext).checkWriteExternalStorage();
    }

    public void onSelectPhoto() {
        ((BaseActivity) mContext).checkReadExternalStorage();
    }

    public void selectImageFromGallery() {
        Intent pickPhoto = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        mContext.startActivityForResult(pickPhoto, StringUtils.REQUEST_SELECT_FILE);
    }

    private void captureImage() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(mContext.getPackageManager()) != null) {
            long timeStam = System.currentTimeMillis();
            mCameraImageFile = new File(getDirectory(), timeStam + ".jpg");
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                    Uri.fromFile(mCameraImageFile));
            mContext.startActivityForResult(takePictureIntent, StringUtils.REQUEST_CAMERA);
        }
    }

    private File getDirectory() {
        File folder = new File(PATH);
        if (!folder.exists())
            folder.mkdirs();
        return folder;
    }

    private void createNewFilePath() {
        long timeStam = System.currentTimeMillis();
        mCompressedImageFile = new File(getDirectory(), timeStam + ".jpg");
    }


    public Compressor getCompressor() {
        return new Compressor.Builder(mContext)
                .setMaxWidth(800)
                .setMaxHeight(600)
                .setCompressFormat(Bitmap.CompressFormat.JPEG)
                .setQuality(50)
                .setDestinationDirectoryPath(PATH)
                .build();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Bitmap imageBitmap;
        if (requestCode == StringUtils.REQUEST_SELECT_FILE && resultCode == StringUtils.RESULT_OK && null != data) {
            try {
                Uri selectImage = data.getData();
                String[] filepathColumn = {MediaStore.Images.Media.DATA};
                Cursor cursor = mContext.getContentResolver().query(selectImage, filepathColumn, null, null, null);
                cursor.moveToFirst();
                int columnIndex = cursor.getColumnIndex(filepathColumn[0]);
                String path = cursor.getString(columnIndex);
                cursor.close();
                File imageFile = new File(path);
                File file = getCompressor().compressToFile(imageFile);
                Log.i("image", file.getAbsolutePath());

                cropImage(selectImage, mContext);

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (requestCode == StringUtils.REQUEST_CAMERA && resultCode == StringUtils.RESULT_OK) {

            if (resultCode == -1) {
                if (mCameraStorageFile != null && mCameraStorageFile.getAbsolutePath() != null) {
                    File fileTemp = new File(mCameraStorageFile.getAbsolutePath());
                    if (mCameraStorageFile.length() <= 0) {
                        mCameraStorageFile.delete();
                    }
                    if (fileTemp != null) {
                        Matrix matrix = getImageMatrix(fileTemp.getAbsolutePath());
                        if (matrix != null) {
                            BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
                            bitmapOptions.inSampleSize = 8;
                            imageBitmap = BitmapFactory.decodeFile(fileTemp.getAbsolutePath(),
                                    bitmapOptions);
                            if (imageBitmap != null)
                                imageBitmap = Bitmap.createBitmap(imageBitmap, 0, 0, imageBitmap.getWidth(), imageBitmap.getHeight(), matrix, true); // rotating bitmap

                            if (imageBitmap != null && mOnImageSelectListener != null) {
                                cropImage(cameraPickUri, mContext);

                            }
                        }
                    }
                }
            }
        } else if (requestCode == Crop.REQUEST_CROP && resultCode == StringUtils.RESULT_OK) {
            if (imagePath != null) {
                final Matrix matrix = getImageMatrix(imagePath);
                if (matrix != null) {
                    BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
                    bitmapOptions.inSampleSize = 8;
                    imageBitmap = BitmapFactory.decodeFile(imagePath,
                            bitmapOptions);
                    if (imageBitmap != null)
                        imageBitmap = Bitmap.createBitmap(imageBitmap, 0, 0, imageBitmap.getWidth(), imageBitmap.getHeight(), matrix, true); // rotating bitmap

                    if (imageBitmap != null && mOnImageSelectListener != null) {
                        if (mOnImageSelectListener != null) {
                            File file = new File(imagePath);
                            mOnImageSelectListener.onImageSelect(file);
                        }
                    }
                }
            }
        } else {
            deleteImage();
        }


    }

    public void deleteImage() {
        if (mCameraImageFile != null && mCameraImageFile.exists()) {
            mCameraImageFile.delete();
        }
        if (mCompressedImageFile != null && mCompressedImageFile.exists()) {
            mCompressedImageFile.delete();
        }
    }

    @Override
    public void onWriteExternalStorageGranted(boolean isGranted) {
        if (isGranted) {
            createNewFilePath();
            captureImage();
        }
    }

    @Override
    public void onReadExternalStorageGranted(boolean isGranted) {
        if (isGranted) {
            createNewFilePath();
            selectImageFromGallery();
        }

    }

    private File createImageFile() throws IOException {
// Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES);
        if (!storageDir.exists())
            storageDir.mkdirs();
        File image = File.createTempFile(
                imageFileName, /* prefix */
                ".jpg", /* suffix */
                storageDir /* directory */
        );

// Save a file: path for use with ACTION_VIEW intents
        imagePath = image.getAbsolutePath();

        return image;
    }


    public interface OnImageSelectListener {
        void onImageSelect(File file);
    }

    public void cropImage(Uri cameraPickedUri, Activity activity) {
        File photoFile = null;
        try {
            photoFile = createImageFile();
        } catch (IOException ex) {
            ex.printStackTrace();

        }
        Crop.of(cameraPickedUri, Uri.fromFile(photoFile)).asSquare().start(activity);
    }

    private void createDirectory() {
        if (isSDCardAvailable()) {
            mCameraStorageDirectory = new File(Environment.getExternalStorageDirectory().toString() + directoryName);
            if (!mCameraStorageDirectory.exists()) {
                mCameraStorageDirectory.mkdir();
            }
        } else {
            if (!mCameraStorageDirectory.exists()) {
                mCameraStorageDirectory = mContext.getDir(directoryName, Context.MODE_PRIVATE);
            }
        }

        if (sFileCounter >= 0) {
            sFileCounter = getImageFileCount();
            sFileCounter++;
            setImageFileCount(sFileCounter);
        }
        mCameraStorageFile = new File(mCameraStorageDirectory, fileName + sFileCounter + ".jpeg");
        try {
            mCameraStorageFile.createNewFile();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isSDCardAvailable() {
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state)) {
            if (spaceAvailable()) {
                return true;
            } else {
                Toast.makeText(mContext, "No space availabe", Toast.LENGTH_SHORT).show();
            }
        }
        return false;
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    private boolean spaceAvailable() {
        StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
        long bytesAvailable;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            bytesAvailable = stat.getBlockSizeLong() * stat.getAvailableBlocksLong();
        } else {
            bytesAvailable = stat.getBlockSize() * stat.getAvailableBlocks();
        }

        float megAvailable = bytesAvailable / (1024.f * 1024.f);
        Log.i("Megs :", String.valueOf(megAvailable));
        return (megAvailable > 5);
    }

    private void setImageFileCount(int time) {
        SharedPreferences settings = mContext.getSharedPreferences("IMAGE_COUNT", 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putInt("File count", time);
        editor.commit();
    }

    private int getImageFileCount() {
        SharedPreferences settings = mContext.getSharedPreferences("IMAGE_COUNT", 0);
        return settings.getInt("File count", 0);
    }

    private Matrix getImageMatrix(String fileName) {
        ExifInterface exif;
        try {
            exif = new ExifInterface(fileName);
            int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, 1);
            Matrix matrix = new Matrix();
            if (orientation == ExifInterface.ORIENTATION_ROTATE_90) {
                matrix.postRotate(90);
            } else if (orientation == ExifInterface.ORIENTATION_ROTATE_180) {
                matrix.postRotate(180);
            } else if (orientation == ExifInterface.ORIENTATION_ROTATE_270) {
                matrix.postRotate(270);
            }
            return matrix;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;

    }
}