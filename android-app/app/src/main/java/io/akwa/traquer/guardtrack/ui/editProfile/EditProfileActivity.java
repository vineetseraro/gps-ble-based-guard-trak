package io.akwa.traquer.guardtrack.ui.editProfile;

import android.content.Intent;

import io.akwa.traquer.guardtrack.common.login.LoginActivity;


public class EditProfileActivity extends DefaultEditProfileActivity{

    @Override
    public Intent getLoginIntent() {
        return new Intent(this, LoginActivity.class);
    }
}
