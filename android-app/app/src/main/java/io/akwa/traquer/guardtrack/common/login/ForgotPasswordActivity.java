package io.akwa.traquer.guardtrack.common.login;

import android.view.View;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.forgotPassword.DefaultForgotPasswordActivity;


public class ForgotPasswordActivity extends DefaultForgotPasswordActivity {
    @Override
    public void setAppName() {
        mAppName.setVisibility(View.VISIBLE);
        mAppName.setImageResource(R.drawable.rep_logo);

    }

}
