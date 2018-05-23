package io.akwa.traquer.guardtrack.common;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.AppLog;
import io.akwa.traquer.guardtrack.common.utils.CurrentLocationUtil;
import io.akwa.traquer.guardtrack.common.utils.PermissionUtil;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.login.LoginActivity;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public abstract class BaseActivity extends AppCompatActivity {

    public CheckAccessFineLocation checkAccessFineLocation;
    public CheckPhoneState checkPhoneState;
    public CheckWriteExternalStorage checkWriteExternalSrorage;
    public CheckHomePagePermission checkHomePagePermission;
    public CheckCameraPermission checkCameraPermission;
    public CheckReadExternalStorage checkReadExternalStorage;
    public CheckRecordAudio checkRecordAudio;
    CurrentLocationUtil currentLocationUtil;
    private BroadcastReceiver mReceiver;


    public void setCheckRecordAudio(CheckRecordAudio checkRecordAudio) {
        this.checkRecordAudio = checkRecordAudio;
    }

    public void setCheckCameraPermission(CheckCameraPermission checkCameraPermission) {
        this.checkCameraPermission = checkCameraPermission;
    }

    public void setCheckReadExternalStorage(CheckReadExternalStorage checkReadExternalStorage) {
        this.checkReadExternalStorage = checkReadExternalStorage;
    }


    public void setCheckWriteExternalSrorage(CheckWriteExternalStorage checkWriteExternalSrorage) {
        this.checkWriteExternalSrorage = checkWriteExternalSrorage;
    }

    public void setCheckAccessFineLocation(CheckAccessFineLocation checkAccessFineLocation) {
        this.checkAccessFineLocation = checkAccessFineLocation;
    }

    public void setCheckPhoneState(CheckPhoneState checkPhoneState) {
        this.checkPhoneState = checkPhoneState;
    }

    public void setCheckHomePagePermissions(CheckHomePagePermission checkHomePagePermissions) {
        this.checkHomePagePermission = checkHomePagePermissions;
    }

    public void checkRecordAudio() {
        if (Build.VERSION.SDK_INT >= 23 && !PermissionUtil.checkPermissionGranted(this, Manifest.permission.RECORD_AUDIO)) {
            PermissionUtil.requestPermission(R.string.enable_audio, PermissionUtil.PERMISSIONS_AUDIO_RECORD, this);
        } else {
            if (checkRecordAudio != null) {
                checkRecordAudio.onRecordAudioGranted(true);
            }
        }
    }

    public void checkWriteExternalStorage() {
        if (Build.VERSION.SDK_INT >= 23 && !PermissionUtil.checkPermissionGranted(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            PermissionUtil.requestPermission(R.string.enable_write_permission, PermissionUtil.PERMISSIONS_REQUEST_WRITE, this);
        } else {
            if (checkWriteExternalSrorage != null) {
                checkWriteExternalSrorage.onWriteExternalStorageGranted(true);
            }
        }
    }

    public void checkReadExternalStorage() {
        if (Build.VERSION.SDK_INT >= 23 && !PermissionUtil.checkPermissionGranted(this, Manifest.permission.READ_EXTERNAL_STORAGE)) {
            PermissionUtil.requestPermission(R.string.enable_read_permission, PermissionUtil.PERMISSIONS_REQUEST_READ, this);
        } else {
            if (checkReadExternalStorage != null) {
                checkReadExternalStorage.onReadExternalStorageGranted(true);
            }
        }
    }

    public void checkCameraPermission() {
        if (Build.VERSION.SDK_INT >= 23 && !PermissionUtil.checkPermissionGranted(this, Manifest.permission.CAMERA)) {
            PermissionUtil.requestPermission(R.string.enable_camera, PermissionUtil.PERMISSIONS_CAMERA, this);
        } else {
            if (checkCameraPermission != null) {
                checkCameraPermission.onCameraPermissionGranted(true);
            }
        }
    }

    public void checkHomePagePermission() {

        if (Build.VERSION.SDK_INT >= 23
                && (!PermissionUtil.checkPermissionGranted(this, Manifest.permission.CAMERA)
                || !PermissionUtil.checkPermissionGranted(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                || !PermissionUtil.checkPermissionGranted(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                || !PermissionUtil.checkPermissionGranted(this, Manifest.permission.ACCESS_FINE_LOCATION))) {
            int[] permissionsRequestCode = {PermissionUtil.PERMISSIONS_CAMERA, PermissionUtil.PERMISSIONS_REQUEST_WRITE, PermissionUtil.PERMISSIONS_REQUEST_READ, PermissionUtil.PERMISSIONS_PHONE_STATE, PermissionUtil.PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION};

            List<String> listPermissionsNeeded = new ArrayList<>();
            if (permissionsRequestCode[0] != PackageManager.PERMISSION_GRANTED) {
                listPermissionsNeeded.add(Manifest.permission.CAMERA);
            }
            if (permissionsRequestCode[1] != PackageManager.PERMISSION_GRANTED) {
                listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
            if (permissionsRequestCode[2] != PackageManager.PERMISSION_GRANTED) {
                listPermissionsNeeded.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            listPermissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
            if (permissionsRequestCode[3] != PackageManager.PERMISSION_GRANTED) {

            }

            PermissionUtil.requestHomePagePermissionFromUser(listPermissionsNeeded, PermissionUtil.MULTIPLE_PERMISSIONS, this);


        } else {
            if (checkHomePagePermission != null) {
                checkHomePagePermission.onPermissionGranted(true);
            }
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case PermissionUtil.PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (checkAccessFineLocation != null) {
                        checkAccessFineLocation.onFineLocationGranted(true);
                    }
                } else {
                    if (checkAccessFineLocation != null) {
                        checkAccessFineLocation.onFineLocationGranted(false);
                    }
                    Toast.makeText(this, R.string.permission_denied, Toast.LENGTH_SHORT).show();
                }
                return;
            }

            case PermissionUtil.PERMISSIONS_PHONE_STATE: {
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (checkPhoneState != null) {
                        checkPhoneState.onPhoneStateGranted(true);
                    }
                } else {
                    if (checkPhoneState != null) {
                        checkPhoneState.onPhoneStateGranted(false);
                    }
                    Toast.makeText(this, R.string.permission_denied, Toast.LENGTH_SHORT).show();
                }
                return;
            }

            case PermissionUtil.PERMISSIONS_REQUEST_WRITE: {
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (checkWriteExternalSrorage != null) {
                        checkWriteExternalSrorage.onWriteExternalStorageGranted(true);
                    }
                } else {
                    if (checkWriteExternalSrorage != null) {
                        checkWriteExternalSrorage.onWriteExternalStorageGranted(false);
                    }
                    Toast.makeText(this, R.string.permission_denied, Toast.LENGTH_SHORT).show();
                }
                return;
            }


            case PermissionUtil.PERMISSIONS_REQUEST_READ: {
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (checkReadExternalStorage != null) {
                        checkReadExternalStorage.onReadExternalStorageGranted(true);
                    }
                } else {
                    if (checkReadExternalStorage != null) {
                        checkReadExternalStorage.onReadExternalStorageGranted(false);
                    }
                    Toast.makeText(this, R.string.permission_denied, Toast.LENGTH_SHORT).show();
                }
                return;
            }

            case PermissionUtil.PERMISSIONS_CAMERA: {
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (checkCameraPermission != null) {
                        checkCameraPermission.onCameraPermissionGranted(true);
                    }
                } else {
                    if (checkCameraPermission != null) {
                        checkCameraPermission.onCameraPermissionGranted(false);
                    }
                    Toast.makeText(this, R.string.permission_denied, Toast.LENGTH_SHORT).show();
                }
                return;
            }

            case PermissionUtil.MULTIPLE_PERMISSIONS: {

                List<String> deniedPermissions = new ArrayList<>();
                Set<String> permissionName = new HashSet<>();

                for (int i = 0; i < permissions.length; i++) {
                    if (grantResults[i] == -1) {
                        if (permissions[i].contains("CAMERA"))
                            permissionName.add("Camera");
                        else if (permissions[i].contains("STORAGE"))
                            permissionName.add("Storage");
                        else if (permissions[i].contains("LOCATION"))
                            permissionName.add("Location");

                        deniedPermissions.add(permissions[i]);
                    }
                }

                if (deniedPermissions.size() == 0)

                    checkHomePagePermission.onPermissionGranted(true);
                else {
                    String deniedPermissonName = android.text.TextUtils.join(",", permissionName);
                    String message;
                    if (permissionName.size() == 1)
                        message = getResources().getString(R.string.app_name) + " won't work without " + deniedPermissonName + ". Tap on GRANT to give this permission.";
                    else
                        message = getResources().getString(R.string.app_name) + " won't work without " + deniedPermissonName + ". Tap on GRANT to give these permissions.";
                    showAlert(message);
                }






                /*
                  if (perms.get(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
                            && perms.get(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
                            && perms.get(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
                            && perms.get(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                        if (checkHomePagePermission != null) {
                            checkHomePagePermission.onPermissionGranted(true);
                        }
                    } else {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)
                                || ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                                || ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                                || ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
                                showAlert();
                        } else {
                            showWarningAlert();
                        }
                    }*/

            }
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        }

    }

    public void showWarningAlert() {
        AlertDialog.Builder adb = new AlertDialog.Builder(this);
        adb.setTitle(R.string.warning_heading);
        adb.setMessage(R.string.warning_message);
        adb.setIcon(android.R.drawable.ic_dialog_alert);
        adb.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                Intent i = new Intent();
                i.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                i.addCategory(Intent.CATEGORY_DEFAULT);
                i.setData(Uri.parse("package:" + getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                i.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                i.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                startActivity(i);

            }
        });
        adb.setNegativeButton(R.string.cancel_button_text, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {

                android.os.Process.killProcess(android.os.Process.myPid());
            }
        });
        adb.show();
    }


    public void showAlert(String message) {
        AlertDialog.Builder adb = new AlertDialog.Builder(this);

        adb.setTitle(R.string.permission_heading);
        adb.setMessage(message);
        adb.setIcon(android.R.drawable.ic_dialog_alert);
        adb.setPositiveButton(R.string.GRANT, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                checkHomePagePermission();

            }
        });
        adb.setNegativeButton(R.string.DENY, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {

                android.os.Process.killProcess(android.os.Process.myPid());


            }
        });
        adb.show();
    }


    public interface CheckAccessFineLocation {
        void onFineLocationGranted(boolean isGranted);
    }

    public interface CheckRecordAudio {
        void onRecordAudioGranted(boolean isGranted);
    }

    public interface CheckPhoneState {
        void onPhoneStateGranted(boolean isGranted);
    }

    public interface CheckWriteExternalStorage {
        void onWriteExternalStorageGranted(boolean isGranted);
    }

    public interface CheckReadExternalStorage {
        void onReadExternalStorageGranted(boolean isGranted);
    }

    public interface CheckCameraPermission {
        void onCameraPermissionGranted(boolean isGranted);
    }

    public interface CheckHomePagePermission {
        void onPermissionGranted(boolean isGranted);
    }

    public void directLogout() {
        PrefUtils.clearDataOnLogout();
        gotoLoginActivity();
    }

    public void gotoLoginActivity() {
        Intent intent = getLoginIntent();
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    public Intent getLoginIntent() {
        //throw new RuntimeException("called from base activity.");
        return new Intent(this, LoginActivity.class);

    }

    @Override
    protected void onDestroy() {
        if (mReceiver!=null){
            unregisterReceiver(mReceiver);
        }
        super.onDestroy();
    }

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    public void updateCurrentLocation() {
        currentLocationUtil = CurrentLocationUtil.getInstance(this);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AppLog.i("class -------"+this.getClass().getSimpleName());
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (currentLocationUtil != null) {
            currentLocationUtil.onStart();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (currentLocationUtil != null) {
            currentLocationUtil.onStop();
        }
    }

    public void createReceiver() {
        mReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                final String action = intent.getAction();

                if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                    final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE,
                            BluetoothAdapter.ERROR);
                    switch (state) {
                        case BluetoothAdapter.STATE_OFF:
                            onBluetoothChange(false);
                            break;
                        case BluetoothAdapter.STATE_ON:
                            onBluetoothChange(true);
                            break;
                    }
                }
            }
        };
        IntentFilter filter = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        registerReceiver(mReceiver, filter);
    }

    public void onBluetoothChange(boolean isOn){
        throw new RuntimeException("Stub");
    }

    public Class getSearchActivity() {
        return  null;
        //return SearchActivity.class;
    }
}
