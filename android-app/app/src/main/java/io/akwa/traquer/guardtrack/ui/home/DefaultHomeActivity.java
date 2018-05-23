package io.akwa.traquer.guardtrack.ui.home;

import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.widget.Toolbar;
import android.widget.TextView;



import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.tracking.Tracker;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;

public abstract class DefaultHomeActivity extends BaseHomeActivity implements BaseFragmentDrawer.FragmentDrawerListener {

    @BindView(R.id.toolbar)
    public Toolbar mToolbar;
    @BindView(R.id.toolbar_title)
    public TextView mToolbarTitle;

    @BindView(R.id.subTitle)
    public TextView subTitle;


    public BaseFragmentDrawer mDrawerFragment;

    public abstract BaseFragmentDrawer getDrawerFragment();

    public abstract int getView();

    public abstract void displayView(int position);

    protected abstract void updateTitle(Fragment f);


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getView());
        ButterKnife.bind(this);
        setSupportActionBar(mToolbar);
        getSupportActionBar().setTitle("");
        mDrawerFragment = getDrawerFragment();
        if (mDrawerFragment != null) {
            mDrawerFragment.setUp((DrawerLayout) findViewById(R.id.drawer_layout), mToolbar);
            mDrawerFragment.setDrawerListener(this);
        }
        fragmentManager.addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
            @Override
            public void onBackStackChanged() {
                Fragment f = getSupportFragmentManager().findFragmentById(R.id.container_body);
                if (f != null) {
                    updateTitle(f);
                }
            }
        });
        updateCurrentLocation();
    }


    public void updateProfile() {
        mDrawerFragment.setUserProfileInfo();
    }

    public void setTitle(String title) {
        mToolbarTitle.setText(title);
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


}
