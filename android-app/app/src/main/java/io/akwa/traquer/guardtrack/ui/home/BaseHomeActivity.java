package io.akwa.traquer.guardtrack.ui.home;

import android.os.Bundle;
import android.support.v4.app.FragmentManager;

import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;


public abstract class BaseHomeActivity extends BaseActivity {


    public FragmentManager fragmentManager;
    public boolean isLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        fragmentManager = getSupportFragmentManager();
        isLogin = PrefUtils.isUserLogin();
    }

}
