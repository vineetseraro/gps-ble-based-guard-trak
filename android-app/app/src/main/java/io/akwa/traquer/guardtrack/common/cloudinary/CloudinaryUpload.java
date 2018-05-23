package io.akwa.traquer.guardtrack.common.cloudinary;

import android.content.Context;

import com.cloudinary.android.MediaManager;
import com.cloudinary.android.callback.ErrorInfo;
import com.cloudinary.android.callback.UploadCallback;
import io.akwa.aksync.AppLog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by rohitkumar on 8/23/17.
 */

public class CloudinaryUpload {
    List<String> imagePath;
    CloudanaryCallBack cloudanaryCallBack;
    Context context;
    Map<String, Boolean> uploadedImage = new HashMap<>();
    List<CloudinaryImage> urls = new ArrayList<>();

    public CloudinaryUpload(Context context, List<String> imagePath, CloudanaryCallBack cloudanaryCallBack) {
        this.imagePath = imagePath;
        this.cloudanaryCallBack = cloudanaryCallBack;
        this.context = context;
    }


    public void uploadImage() {
        uploadedImage.clear();
        urls.clear();
        for (int i = 0; i < imagePath.size(); i++) {
         MediaManager.get().upload(imagePath.get(i)).callback(new UploadCallback() {
                @Override
                public void onStart(String requestId) {
                    AppLog.i("cloud_onStart ==" + requestId);

                }

                @Override
                public void onProgress(String requestId, long bytes, long totalBytes) {
                    AppLog.i("cloud_onProgress ==" + requestId);
                }

                @Override
                public void onSuccess(String requestId, Map resultData) {
                    //  uploadedImage.put(requestId,true);
                    AppLog.i("cloud_onSuccess ==" + requestId);
                    // if(isAllRequestDone())
                    String url = (String) resultData.get("url");
                    CloudinaryImage cloudinaryImage=new CloudinaryImage();
                    cloudinaryImage.setMeta("");
                    cloudinaryImage.setUrl(url);
                    urls.add(cloudinaryImage);
                    if (urls.size()==imagePath.size())
                        cloudanaryCallBack.onUploadImages(urls, "Image Upload Error");
                }

                @Override
                public void onError(String requestId, ErrorInfo error) {
                     AppLog.i("cloud_onError ==" + requestId);
                    //  uploadedImage.put(requestId,true);
                      //  cancelRequest();
                        cloudanaryCallBack.onUploadImages(null, "Image Upload Error");
                }

                @Override
                public void onReschedule(String requestId, ErrorInfo error) {
                    AppLog.i("cloud_onReschedule ==" + requestId);

                }
            }).dispatch();
          //  uploadedImage.put(id, false);

        }


    }


    public interface CloudanaryCallBack {

        public void onUploadImages(List<CloudinaryImage> imageList, String errorMessage);

    }

    private boolean isAllRequestDone() {
        boolean isUpdate = true;
        for (Map.Entry<String, Boolean> entry : uploadedImage.entrySet()) {
            if (!entry.getValue()) {
                isUpdate = false;
                break;
            }

        }
        return isUpdate;
    }

   public void cancelRequest()
   {

       for (Map.Entry<String, Boolean> entry : uploadedImage.entrySet()) {
           MediaManager.get().cancelRequest(entry.getKey());

       }

   }
}


