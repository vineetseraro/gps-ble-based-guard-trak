package io.akwa.traquer.guardtrack.splash;

import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.widget.ImageView;


import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;

public abstract class BaseSplashActivity extends AppCompatActivity {

    @BindView(R.id.iv_logo)
    ImageView imgLogo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        ButterKnife.bind(this);
    }

    @Override
    protected void onStart() {
        super.onStart();
        showSplash();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    public abstract void launchLoginActivity();
    public abstract void setAppName();

    public abstract void launchHomeActivity();

    private void showSplash() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (PrefUtils.isUserLogin()) {
                    launchHomeActivity();
                } else {
                    launchLoginActivity();
                }
            }
        }, 2000);
    }
}
