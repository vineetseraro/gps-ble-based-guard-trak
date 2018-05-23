package io.akwa.traquer.guardtrack.ui.guardtrack.history;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.ui.notification.NotificationActivity;
import io.akwa.traquer.guardtrack.ui.notification.NotificationFragment;

public class HistoryActivity extends BaseActivity {

    @BindView(R.id.toolbar_title)
    TextView mTitle;
    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @BindView(R.id.subTitle)
      TextView subTitle;
    private HistoryFragment notificationFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        ButterKnife.bind(this);
        setupActionBar();
        addFragment();
    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.history_title));
        subTitle.setVisibility(View.GONE);
    }


    private void addFragment() {
        notificationFragment = new HistoryFragment();
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.container_body, notificationFragment, "NotificationFragment");
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case R.id.menu_search:

                break;
            case android.R.id.home:
                onBackPressed();
                break;
        }

        return true;
    }

  /*  @OnClick(R.id.deleteButton)
    public void removeAll(){
        notificationFragment.removeAll();
    }*/
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Fragment fragment = getSupportFragmentManager().findFragmentByTag("NotificationFragment");
        if (fragment != null && fragment instanceof HistoryFragment && fragment.isVisible()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
    }
}
