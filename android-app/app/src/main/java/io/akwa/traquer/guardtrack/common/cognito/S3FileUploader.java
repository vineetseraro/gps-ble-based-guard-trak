package io.akwa.traquer.guardtrack.common.cognito;

import android.content.Context;
import android.os.AsyncTask;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;

import java.io.File;
import java.util.List;

import io.akwa.traquer.guardtrack.common.utils.AppLog;
import io.akwa.traquer.guardtrack.common.utils.Constant;

/**
 * Created by rohitkumar on 9/15/17.
 */

public class S3FileUploader extends AsyncTask<Void,Void,String> {
    Context context;
    List<File> files;
    S3UploaderCallBack s3UploaderCallBack;

    public S3FileUploader(Context context,List<File> files,S3UploaderCallBack s3UploaderCallBack) {
        this.files=files;
        this.context=context;
        this.s3UploaderCallBack=s3UploaderCallBack;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    protected String doInBackground(Void... params) {
        String result=null;
        try {

               CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
                    context.getApplicationContext(),
                    "us-east-1:9c5e5bca-cfef-40c6-8f18-575692dcab41",
                    Regions.US_EAST_1 // Region enum
            );
            //File file = files.get(0);s
            AmazonS3Client s3Client = new AmazonS3Client(credentialsProvider);
            for(int i=0;i<files.size();i++) {
                PutObjectRequest putRequest = new PutObjectRequest(Constant.AWS_BUCKET, files.get(i).getName(),
                        files.get(i));
                PutObjectResult putResponse = s3Client.putObject(putRequest);
                result = putResponse.getContentMd5();
            }
        }
        catch (Exception exception)
        {
            AppLog.custom("S3",exception.getMessage());
        }

        return result;
    }

    @Override
    protected void onPostExecute(String resposne) {
        super.onPostExecute(resposne);
        this.s3UploaderCallBack.onFileUploaded(resposne);
    }

    public interface S3UploaderCallBack{
        void onFileUploaded(String response);


    }
}
