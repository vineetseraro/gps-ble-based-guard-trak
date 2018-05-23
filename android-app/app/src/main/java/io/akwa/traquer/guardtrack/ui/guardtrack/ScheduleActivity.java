package io.akwa.traquer.guardtrack.ui.guardtrack;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.model.ReaderGetNotificationsResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;
import io.akwa.traquer.guardtrack.ui.notification.NotificationListAdapter;
import io.akwa.traquer.guardtrack.ui.notification.NotificationPresenter;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;


public class ScheduleActivity extends AppCompatActivity implements ScheduleAdapter.ItemClickListener {
    @BindView(R.id.toolbar_title)
    TextView title;

    @BindView(R.id.toolbar)
    Toolbar toolbar;

    @BindView(R.id.listView)
    EmptyRecyclerView mRecyclerView;

    @BindView(R.id.tv_empty_view)
    LinearLayout mEmptyView;

    private ScheduleAdapter scheduleAdapter;


    List<Datum> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_schedule);
        ButterKnife.bind(this);
        setupActionBar();
        list=getIntent().getParcelableArrayListExtra("tasks");

        if(list!=null&&list.size()>0) {
            mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
            mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(this));
            scheduleAdapter = new ScheduleAdapter(this, list, this);
            mRecyclerView.setAdapter(scheduleAdapter);
        }

        else {
            mEmptyView.setVisibility(View.VISIBLE);
        }
    }

    private void setupActionBar() {
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        title.setText("Select Schedule");
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.menu_search:

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
    public void onItemClicked(Datum data) {

        Intent returnIntent = new Intent();
        returnIntent.putExtra("task", data);
        setResult(Activity.RESULT_OK, returnIntent);
        finish();

    }
}
