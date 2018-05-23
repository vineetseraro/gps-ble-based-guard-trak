package io.akwa.traquer.guardtrack.common.utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;



import java.io.File;

import id.zelory.compressor.Compressor;
import io.akwa.traquer.guardtrack.common.BaseActivity;

public class PhotoUtility implements BaseActivity.CheckWriteExternalStorage, BaseActivity.CheckReadExternalStorage {
    private static final String PATH = Environment.getExternalStorageDirectory() + "/" + StringUtils.APP_NAME + "/Images";
    private Context mContext;
    private OnImageSelectListener mOnImageSelectListener;
    private File mCameraImageFile, mCompressedImageFile;

    public PhotoUtility(Context pContext, OnImageSelectListener imageSelectListener) {
        mContext = pContext;
        mOnImageSelectListener = imageSelectListener;
        ((BaseActivity) mContext).setCheckWriteExternalSrorage(this);
        ((BaseActivity) mContext).setCheckReadExternalStorage(this);
    }


    public void selectImage() {
        final CharSequence[] items = {"Take a photo", "Select a photo", "Cancel"};
        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        builder.setTitle("Upload a photo");
        builder.setCancelable(true);
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int item) {

                if (items[item].equals("Take a photo")) {
                    ((BaseActivity) mContext).checkWriteExternalStorage();
                } else if (items[item].equals("Select a photo")) {
                    ((BaseActivity) mContext).checkReadExternalStorage();
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
        ((Activity) mContext).startActivityForResult(pickPhoto, StringUtils.REQUEST_SELECT_FILE);
    }

    private void captureImage() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(mContext.getPackageManager()) != null) {
            long timeStam = System.currentTimeMillis();
            mCameraImageFile = new File(getDirectory(), timeStam + ".jpg");
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                    Uri.fromFile(mCameraImageFile));
            ((Activity) mContext).startActivityForResult(takePictureIntent, StringUtils.REQUEST_CAMERA);
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
                if (mOnImageSelectListener != null) {
                    mOnImageSelectListener.onImageSelect(file);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (requestCode == StringUtils.REQUEST_CAMERA && resultCode == StringUtils.RESULT_OK) {

            File file = getCompressor().compressToFile(mCameraImageFile);
            Log.i("image", file.getAbsolutePath());
            if (mOnImageSelectListener != null) {
                mOnImageSelectListener.onImageSelect(file);
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


    public interface OnImageSelectListener {
        void onImageSelect(File file);
    }


}


