package io.akwa.traquer.guardtrack.common.login;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.text.method.PasswordTransformationMethod;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import io.akwa.aklogs.NBLogger;


import java.io.File;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.BaseApplication;
import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.cognito.AppHelper;
import io.akwa.traquer.guardtrack.common.tracking.Tracker;
import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInfo;
import io.akwa.traquer.guardtrack.common.utils.DataValidator;
import io.akwa.traquer.guardtrack.common.utils.LocationBluetoothPermissionUtility;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.common.utils.Util;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetSettingsResponse;
import io.akwa.traquer.guardtrack.updatedevice.RegisterDeviceApiHandler;
import io.akwa.traquer.guardtrack.updatedevice.RegisterUpdateDevicePresneter;

public abstract class DefaultLoginActivity extends BaseLoginActivity implements BaseActivity.CheckHomePagePermission,RegisterUpdateDevicePresneter.View {
    private LocationBluetoothPermissionUtility locationBluetoothPermissionUtility;

    @BindView(R.id.txtForgotPassword)
    public TextView mForgotPassword;
    @BindView(R.id.edtEmail)
    public EditText mEmail;
    @BindView(R.id.edt_password)
    public EditText mPassword;
    @BindView(R.id.btn_submit)
    public TextView mLogin;
    @BindView(R.id.appNameTxt)
    public ImageView mAppName;
    @BindView(R.id.btn_show)
    public TextView mbtnShow;
    @BindView(R.id.forgotPasswordLayout)
    public LinearLayout mforgotPasswordLayout;

    @BindView(R.id.txtProdcution)
    TextView txtProduction;



    public abstract void setUpView();

    public abstract void setAppName();

    protected abstract Intent getHomeIntent();

    protected abstract Intent getForgotPasswordIntent();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_new);
        setCheckHomePagePermissions(this);
        checkHomePagePermission();
        ButterKnife.bind(this);
        setAppName();
        setUpView();
        AppHelper.init(getApplicationContext());
        mbtnShow.setTag("hidden");
       if(!PrefUtils.getCode().equals(""))
        {
            String code=PrefUtils.getCode();
            setVersionText(" Code= "+code);
            startTracking();
        }
        else
        {
            DeviceInfo deviceInfo= BaseApplication.getDeviceInfo();
            updateDeviceStatus(deviceInfo);
        }
       /* DeviceInfo deviceInfo= BaseApplication.getDeviceInfo();
        updateDeviceStatus(deviceInfo);*/
    }
    public String getAppVersion() {
        String versionCode = "1.0";
        try {
            versionCode = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return versionCode;
    }

    public void setVersionText(String extraText)
    {
        if(extraText==null)
            extraText="";
        if (BuildConfig.IS_PROD) {
            txtProduction.setText("V " + BuildConfig.VERSION_NAME + " P "+extraText);
        } else {
            txtProduction.setText("V" + BuildConfig.VERSION_NAME + " Q "+extraText);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        mPassword.setText("");
    }

    @OnClick(R.id.forgotPasswordLayout)
    public void forgetPassword() {
        Intent intent = getForgotPasswordIntent();
        startActivity(intent);
    }


    @OnClick(R.id.btn_show)
    public void showPassword() {
        if (mbtnShow.getTag().equals("shown")) {
            mbtnShow.setText(getString(R.string.show));
            mbtnShow.setTag("hidden");
            mPassword.setTransformationMethod(new PasswordTransformationMethod());
            if (mPassword.getText().length() > 0)
                mPassword.setSelection(mPassword.getText().length());
        } else {
            mbtnShow.setText(getString(R.string.hide));
            mPassword.setTransformationMethod(null);
            mbtnShow.setTag("shown");
            if (mPassword.getText().length() > 0)
                mPassword.setSelection(mPassword.getText().length());
        }

    }


    @OnClick(R.id.txtSendDiagnostic)
    public void sendDiagnosticClick()
    {
        Util.sendDiagnostic(this);
    }

    @OnClick(R.id.btn_submit)
    public void loginWithFields() {
        if (!mEmail.getText().toString().equals("") && !mPassword.getText().toString().equals("")) {
            if (DataValidator.isValidEmailAddress(mEmail.getText().toString()))
                customLogin(mEmail.getText().toString(), mPassword.getText().toString());
            else
                Toast.makeText(this, getResources().getString(R.string.enter_valid_email), Toast.LENGTH_LONG).show();
        } else if (mEmail.getText().toString().equals("")) {
            Toast.makeText(this, getResources().getString(R.string.enter_email), Toast.LENGTH_LONG).show();
        } else if (mPassword.getText().toString().equals("")) {
            Toast.makeText(this, getResources().getString(R.string.enter_password), Toast.LENGTH_LONG).show();
        }
    }
    public void setSetting(ReaderGetSettingsResponse readerGetSettingsResponse) {
        PrefUtils.setDefaultView(readerGetSettingsResponse.getDashboardDefaultView());
        PrefUtils.setSortBy(readerGetSettingsResponse.getDashboardSortBy());
        PrefUtils.setSortOrder(readerGetSettingsResponse.getDashboardSortOrder());
        PrefUtils.setNotification(readerGetSettingsResponse.getNotifications());
        PrefUtils.setVibration(readerGetSettingsResponse.getVibration());
        PrefUtils.setSound(readerGetSettingsResponse.getSound());
        PrefUtils.setLed(readerGetSettingsResponse.getLed());
        PrefUtils.setBeaconStatus(readerGetSettingsResponse.getBeaconServiceStatus());
    }

    @Override
    public void goToNextActivity(String message) {
        Intent intent = getHomeIntent();
        intent.putExtra(StringUtils.IntentKey.SESSION_MESSAGE, message);
        startActivity(intent);
        finish();
    }


    void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory != null && fileOrDirectory.isDirectory() && fileOrDirectory.listFiles() != null)
            for (File child : fileOrDirectory.listFiles())
                deleteRecursive(child);
        fileOrDirectory.delete();
    }


    public void sendDiagnostic() {

        ArrayList<Uri> fileList = NBLogger.getUriList();
        if (fileList.size() > 0) {
            Intent i = new Intent(Intent.ACTION_SEND_MULTIPLE);

            i.setType("text/plain");
            final PackageManager pm = this.getPackageManager();
            final List<ResolveInfo> matches = pm.queryIntentActivities(i, 0);
            String className = null;
            for (final ResolveInfo info : matches) {
                if (info.activityInfo.packageName.equals("com.google.android.gm")) {
                    className = info.activityInfo.name;

                    if(className != null && !className.isEmpty()){
                        break;
                    }
                }
            }
            i.putParcelableArrayListExtra(Intent.EXTRA_STREAM, fileList);
            i.putExtra(Intent.EXTRA_EMAIL, "sujoy@nicbit.com");
            i.setClassName("com.google.android.gm", className);
            startActivity(i);
        } else {
            Toast.makeText(this, "No Log file available", Toast.LENGTH_LONG).show();
        }

    }


    @Override
    public void onDeviceUpdate(ApiBaseResponse response, NicbitException e) {
        if(response!=null) {
            if ( response.getCode() == 200 || response.getCode() == 201) {
                PrefUtils.setProjectId(response.getData().getClient().getProjectId());
                PrefUtils.setClientId(response.getData().getClient().getClientId());
                PrefUtils.setCode(response.getData().getCode());
                PrefUtils.setDeviceId(response.getData().getDeviceId());
                PrefUtils.setUuid(response.getData().getUuid());
                PrefUtils.setMajor(response.getData().getMajor());
                PrefUtils.setMinor(response.getData().getMinor());
                startTracking();
                setVersionText(" Code= " + response.getData().getCode());
            }
        }
    }

    public void startTracking()
    {
        if (!PrefUtils.getCode().equals("")&&PrefUtils.getBeaconStatus()) {
            if (Build.VERSION.SDK_INT >= 23) {
                if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    Tracker.startTracking();
                }
            } else {
                Tracker.startTracking();
            }
        }
    }

    public void updateDeviceStatus(DeviceInfo deviceInfo) {
        RegisterDeviceApiHandler deviceApiHandler = new RegisterDeviceApiHandler(this);
        deviceApiHandler.deviceUpdate(deviceInfo);

    }

    @Override
    public void onPermissionGranted(boolean isGranted) {
        if (!isGranted) {

        } else {
            locationBluetoothPermissionUtility = new LocationBluetoothPermissionUtility(this);
            locationBluetoothPermissionUtility.checkLocationOnOff();
            locationBluetoothPermissionUtility.setLocationListener(new LocationBluetoothPermissionUtility.LocationBluetoothListener() {
                @Override
                public void onLocationON() {
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
                }

                @Override
                public void onLocationOFF() {
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
                }

                @Override
                public void onBluetoothON() {

                    if (Build.VERSION.SDK_INT >= 23) {
                        if (ContextCompat.checkSelfPermission(DefaultLoginActivity.this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                            if(!PrefUtils.getCode().equals("")&&!PrefUtils.getClientId().equals("")&&!PrefUtils.getClientId().equals(""))
                                startTracking();
                            else
                            {
                                DeviceInfo deviceInfo= BaseApplication.getDeviceInfo();
                                updateDeviceStatus(deviceInfo);
                            }
                        }

                    } else {
                        if(!PrefUtils.getCode().equals("")&&!PrefUtils.getClientId().equals("")&&!PrefUtils.getClientId().equals(""))
                            startTracking();
                        else
                        {
                            DeviceInfo deviceInfo= BaseApplication.getDeviceInfo();
                            updateDeviceStatus(deviceInfo);
                        }
                    }

                }

                @Override
                public void onBluetoothOFF() {

                }
            });


        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (locationBluetoothPermissionUtility != null) {
            locationBluetoothPermissionUtility.onActivityResult(requestCode, resultCode, data);
        }
    }





}
