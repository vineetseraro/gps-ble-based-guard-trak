package io.akwa.traquer.guardtrack.common.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.ReaderGetSettingsResponse;
import io.akwa.traquer.guardtrack.ui.home.HomeActivity;


public class LoginActivity extends DefaultLoginActivity {
    public static final String TAG = "LoginActivity";


    @Override
    public void setUpView() {
        if (!BuildConfig.IS_PROD) {
         /*   mEmail.setText("ankit.vaish+1@nicbit.com");
            mEmail.setText("sharma.niharika74@yahoo.in");*/
        }
    }

    @Override
    public void setAppName() {
        mAppName.setVisibility(View.VISIBLE);
        mAppName.setImageResource(R.drawable.rep_logo);
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

       // setCheckHomePagePermissions(this);
        //checkHomePagePermission();


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
    protected Intent getHomeIntent() {
        return new Intent(this, HomeActivity.class);
    }

    @Override
    protected Intent getForgotPasswordIntent() {
        return new Intent(this, ForgotPasswordActivity.class);
    }

    @Override
    protected void onRestart() {
        super.onRestart();

    }




}
