package io.akwa.traquer.guardtrack.ui.trackingsetting;

import android.app.Activity;
import android.support.design.widget.TabLayout;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.ui.enums.DefaultView;


public class TrackingSettingActivity extends AppCompatActivity {
    @BindView(R.id.tab_layout)
    TabLayout mTabLayout;
    private TabClass tabClass;

    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @BindView(R.id.toolbar_title)
    TextView mTitle;
    TrackingSettingFragment mSettingFragment;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tracking_setting);
        ButterKnife.bind(this);
        setupActionBar();
        tabClass = new TabClass(this);
        setPagerAdapter();
        addFragment();



    }

    private void setPagerAdapter() {
        for (int i = 0; i < 3; i++) {

            mTabLayout.addTab(mTabLayout.newTab());
            mTabLayout.getTabAt(i).setCustomView(tabClass.getTabView(i));
        }


       mTabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {


                //caseListingFragment.scrollToPosition(0);
                mSettingFragment.setTabPosition(tab.getPosition());
                tabClass.getSelectedTabView(tab.getPosition(), tab);
                EventsLog.customEvent("REP_HOME", "TAB", tabClass.tabValues[tab.getPosition()]);
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                tabClass.getUnSelectedTabView(tab.getPosition(), tab);
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.tracking_settings));
    }

    private void addFragment() {
        mSettingFragment = new TrackingSettingFragment();
        mSettingFragment.setTabPosition(0);
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.container_body, mSettingFragment, "");
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;

        }

        return true;
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }

    @Override
    public void onBackPressed() {
        /*if(mSettingFragment.checkSettingsChanged()) {
            mSettingFragment.setDataInPreferences();
            mSettingFragment.saveData();
        }*/
        setResult(Activity.RESULT_OK);
        finish();
    }

    private int selectDefaultTab() {
        String defaultView = PrefUtils.getDefaultView();
        DefaultView tabByName = DefaultView.getTabByName(defaultView);
        TabLayout.Tab tab = mTabLayout.getTabAt(tabByName.getPosition());
        tab.select();
        tabClass.getSelectedTabView(tabByName.getPosition(), tab);
        return tabByName.getPosition();
    }

}
