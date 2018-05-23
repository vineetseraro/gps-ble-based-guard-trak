package io.akwa.traquer.guardtrack.common.utils;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.Toast;


import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import io.akwa.aklogs.NBLogger;


import java.io.File;
import java.util.ArrayList;

import io.akwa.trakit.rulehandler.Config;
import io.akwa.traquer.guardtrack.common.cognito.S3FileUploader;

public class Util {

    public static boolean validateCountryCodeAndPhoneNumber(String countryCode, String phoneNumber) {
        boolean isValid;

        if (countryCode != null && countryCode.length() > 0 && phoneNumber.length() > 0) {
            if (isValidPhoneNumber(phoneNumber)) {
                isValid = validateUsingLibPhoneNumber(countryCode, phoneNumber);
                return isValid;
            }
        }
        return false;
    }

    public static boolean isValidPhoneNumber(CharSequence phoneNumber) {
        return !TextUtils.isEmpty(phoneNumber) && Patterns.PHONE.matcher(phoneNumber).matches();
    }

    public static boolean validateUsingLibPhoneNumber(String countryCode, String phNumber) {
        PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
        Phonenumber.PhoneNumber phoneNumber;
        try {
            String isoCode = phoneNumberUtil.getRegionCodeForCountryCode(Integer.parseInt(countryCode));
            phoneNumber = phoneNumberUtil.parse(phNumber, isoCode);
        } catch (NumberParseException e) {
            return false;
        } catch (Exception e) {
            return false;
        }

        return (phoneNumberUtil.isValidNumber(phoneNumber));
    }



    public static void sendDiagnostic(Context context) {
        ArrayList<File> fileList = NBLogger.getFiles();
        if (fileList.size() > 0) {
            S3FileUploader s3FileUploader=new S3FileUploader(context, fileList, new S3FileUploader.S3UploaderCallBack() {
                @Override
                public void onFileUploaded(String response) {
                    AppLog.custom("S3Upload",response);

                }
            });
            s3FileUploader.execute();


            ArrayList<Uri> uris= NBLogger.getUriList();
            Intent i = new Intent(Intent.ACTION_SEND_MULTIPLE);
            i.setType("text/plain");
          /*  final PackageManager pm = context.getPackageManager();
            final List<ResolveInfo> matches = pm.queryIntentActivities(i, 0);
            String className = null;
            for (final ResolveInfo info : matches) {
                if (info.activityInfo.packageName.equals("com.google.android.gm")) {
                    className = info.activityInfo.name;

                    if(className != null && !className.isEmpty()){
                        break;
                    }
                }
            }*/
            i.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
            i.putExtra(Intent.EXTRA_EMAIL, "dev@akwa.io");
           // i.setClassName("com.google.android.gm", className);
            context.startActivity(i);
        } else {
            Toast.makeText(context, "No Log file available", Toast.LENGTH_LONG).show();
        }

    }

    public static boolean isInternetConnected(Context context)
    {
        ConnectivityManager cm =
                (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean isConnected = activeNetwork != null &&
                activeNetwork.isConnectedOrConnecting();
        return isConnected;

    }

}
