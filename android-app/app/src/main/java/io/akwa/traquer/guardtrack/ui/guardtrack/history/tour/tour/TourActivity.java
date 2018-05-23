package io.akwa.traquer.guardtrack.ui.guardtrack.history.tour.tour;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.ui.guardtrack.history.HistoryFragment;

public class TourActivity extends BaseActivity {

    @BindView(R.id.toolbar_title)
    TextView mTitle;
    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @BindView(R.id.subTitle)
      TextView subTitle;
    private TourFragment notificationFragment;

    String tourId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tour);
        ButterKnife.bind(this);
        tourId=getIntent().getStringExtra("tourId");
        setupActionBar();
        addFragment();
    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText("Events");
        subTitle.setVisibility(View.GONE);
    }


    private void addFragment() {
        notificationFragment = TourFragment.newInstance(tourId);
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
