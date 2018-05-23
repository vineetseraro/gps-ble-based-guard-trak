package io.akwa.traquer.guardtrack.splash;

import android.content.Intent;
import android.os.Bundle;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.login.LoginActivity;
import io.akwa.traquer.guardtrack.ui.home.HomeActivity;


public class StrykerSplashActivity extends BaseSplashActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public void launchLoginActivity() {
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }

    @Override
    public void setAppName() {
       imgLogo.setImageResource(R.drawable.rep_splash);

    }


    @Override
    public void launchHomeActivity() {
        startActivity(new Intent(this, HomeActivity.class));
        finish();
    }
}
