package io.akwa.traquer.guardtrack.ui.contactsettings;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;


public class ContactSettingActivity extends AppCompatActivity {

    @BindView(R.id.toolbar)
    Toolbar mToolbar;
    @BindView(R.id.toolbar_title)
    TextView mTitle;
    ContactSettingFragment mSettingFragment;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.contact_setting_activity);
        ButterKnife.bind(this);
        setupActionBar();
        addFragment();

    }


    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.contact_settings));
    }

    private void addFragment() {
        mSettingFragment = new ContactSettingFragment();
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


}
