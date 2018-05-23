package io.akwa.traquer.guardtrack.forgotPassword;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.ForgotPasswordContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.handlers.ForgotPasswordHandler;


import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnCheckedChanged;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.cognito.AppHelper;
import io.akwa.traquer.guardtrack.common.utils.DataValidator;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;

public abstract class DefaultForgotPasswordActivity extends BaseForgotPasswordActivity {

    @BindView(R.id.appNameTxt)
    public ImageView mAppName;

    @BindView(R.id.edtEmail)
    public EditText medtEmail;

    @BindView(R.id.txtCancel)
    public TextView mtxtCancel;

    @BindView(R.id.btnResetPassword)
    public TextView mbtnResetPassword;

    @BindView(R.id.edtNewPassword)
    EditText edtNewPassword;

    @BindView(R.id.codeLayout)
    RelativeLayout codeLayout;


    @BindView(R.id.edtToken)
    public EditText mEdtCode;

    @BindView(R.id.resendOTP)
    TextView mResendOtp;

    @BindView(R.id.already_have_code_chkbx)
    public CheckBox mAlreadyHaveCode;

    ForgotPasswordContinuation forgotPasswordContinuation;

    public abstract void setAppName();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);
        ButterKnife.bind(this);
        setAppName();
        configureLayout(false);
    }

    @OnClick(R.id.txtCancel)
    public void onCancel() {
        medtEmail.setText("");
        finish();
    }

    @OnCheckedChanged(R.id.already_have_code_chkbx)
    public void onChecked(boolean isChecked) {

        configureLayout(isChecked);
    }

    public void configureLayout(boolean isChecked) {
        if (isChecked) {
            codeLayout.setVisibility(View.VISIBLE);
            mbtnResetPassword.setText(getResources().getString(R.string.submit_button_text));
        } else {
            codeLayout.setVisibility(View.GONE);
            mbtnResetPassword.setText(getResources().getString(R.string.send_button_text));

        }
    }

    @OnClick(R.id.resendOTP)
    public void resendCode() {

        if (!emptyEditText(medtEmail)) {
            if (DataValidator.isValidEmailAddress(medtEmail.getText().toString())) {
                DialogClass.showDialog(this, getString(R.string.msg_wait));
                AppHelper.getPool().getUser(medtEmail.getText().toString()).forgotPasswordInBackground(forgotPasswordHandler);


            } else
                Toast.makeText(this, getResources().getString(R.string.enter_valid_email), Toast.LENGTH_LONG).show();

        } else {
            Toast.makeText(this, getResources().getString(R.string.enter_inputs), Toast.LENGTH_LONG).show();
        }

    }



    @OnClick(R.id.btnResetPassword)
    public void forgotPassword() {

        if (mbtnResetPassword.getText().toString().equalsIgnoreCase(getResources().getString(R.string.send_button_text))) {
            if (!emptyEditText(medtEmail)) {
                if (DataValidator.isValidEmailAddress(medtEmail.getText().toString())) {

                    DialogClass.showDialog(this, getString(R.string.msg_wait));
                    AppHelper.getPool().getUser(medtEmail.getText().toString()).forgotPasswordInBackground(forgotPasswordHandler);


                } else
                    Toast.makeText(this, getResources().getString(R.string.enter_valid_email), Toast.LENGTH_LONG).show();

            } else {
                Toast.makeText(this, getResources().getString(R.string.enter_inputs), Toast.LENGTH_LONG).show();
            }
        } else if (mbtnResetPassword.getText().toString().equalsIgnoreCase(getResources().getString(R.string.submit_button_text))) {
            if (!emptyEditText(mEdtCode) && !emptyEditText(edtNewPassword)) {

                if (DataValidator.isValidEmailAddress(medtEmail.getText().toString())) {
                    DialogClass.showDialog(this, getString(R.string.msg_wait));
                    forgotPasswordContinuation.setPassword(edtNewPassword.getText().toString());
                    forgotPasswordContinuation.setVerificationCode(mEdtCode.getText().toString());
                    forgotPasswordContinuation.continueTask();

                } else {
                    Toast.makeText(this, getResources().getString(R.string.enter_valid_email), Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(this, getResources().getString(R.string.enter_inputs), Toast.LENGTH_LONG).show();
            }
        }

    }





    private void showCodeLayout() {
        codeLayout.setVisibility(View.VISIBLE);
        medtEmail.setEnabled(false);
        mAlreadyHaveCode.setVisibility(View.INVISIBLE);
        mbtnResetPassword.setText(getResources().getString(R.string.submit_button_text));
    }

    public boolean emptyEditText(EditText editText) {
        return editText.getText().toString().equals("");

    }



    // Callbacks
    ForgotPasswordHandler forgotPasswordHandler = new ForgotPasswordHandler() {
        @Override
        public void onSuccess() {
            DialogClass.dismissDialog(DefaultForgotPasswordActivity.this);
            AlertDialog.Builder builder = new AlertDialog.Builder(DefaultForgotPasswordActivity.this);
            builder.setMessage(getResources().getString(R.string.password_changed_successfully))
                    .setCancelable(false)
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                           finish();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();
            EventsLog.customEvent("PASSWORD RESET", "SUCCESS","YES");
        }

        @Override
        public void getResetCode(ForgotPasswordContinuation forgotPasswordContinuation) {
            DefaultForgotPasswordActivity.this.forgotPasswordContinuation=forgotPasswordContinuation;
            DialogClass.dismissDialog(DefaultForgotPasswordActivity.this);
            EventsLog.customEvent("OTP REQUEST", "SUCCESS","YES");
            showCodeLayout();
            Toast.makeText(DefaultForgotPasswordActivity.this, getResources().getString(R.string.code_send), Toast.LENGTH_LONG).show();

        }

        @Override
        public void onFailure(Exception e) {
            DialogClass.dismissDialog(DefaultForgotPasswordActivity.this);
            DialogClass.alerDialog(DefaultForgotPasswordActivity.this, AppHelper.formatException(e));

        }
    };


}
