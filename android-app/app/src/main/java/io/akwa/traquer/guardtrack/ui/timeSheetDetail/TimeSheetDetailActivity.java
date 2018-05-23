package io.akwa.traquer.guardtrack.ui.timeSheetDetail;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.home.DatePickerFragment;
import io.akwa.traquer.guardtrack.ui.home.model.DatePickerInterface;
import io.akwa.traquer.guardtrack.ui.map.BaseMapsActivity;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailItem;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponse;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

import static io.akwa.traquer.guardtrack.common.utils.DateFormater.compareDateOnly;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getApiDate;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getDisplayTime;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getTodayDate;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class TimeSheetDetailActivity extends BaseActivity implements TimeSheetDetailContract.View,SwipeRefreshLayout.OnRefreshListener, View.OnClickListener {

    @BindView(R.id.toolbar_title)
    TextView mTitle;
    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @BindView(R.id.timesheet_list)
    EmptyRecyclerView mRecyclerView;

    @BindView(R.id.tv_empty_view)
    LinearLayout mEmptyView;

    @BindView(R.id.swipeRefreshLayout)
    SwipeRefreshLayout mSwipeRefreshLayout;

    @BindView(R.id.txtCurrent)
    TextView txtCurrent;
    @BindView(R.id.btnNxt)
    ImageButton btnNxt;

    @BindView(R.id.headerBar)
    RelativeLayout headerBar;

    @BindView(R.id.btnPre)
    ImageButton btnPrevious;
    Date currentDate = null;
    
    
    private TimeSheetDetailPresenter mActionsListener;
    private TimeSheetDetailListAdapter timeSheetDetailListAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_timesheet_detail);
        ButterKnife.bind(this);
        String extraDate = getIntent().getStringExtra(StringUtils.DATE);
        mActionsListener = new TimeSheetDetailPresenter(this);
        setupActionBar();

        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(this));

        mSwipeRefreshLayout.setOnRefreshListener(this);

        timeSheetDetailListAdapter = new TimeSheetDetailListAdapter(this, new ArrayList<TimeSheetDetailItem>());
        mRecyclerView.setAdapter(timeSheetDetailListAdapter);
        mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                int topRowVerticalPosition = (recyclerView == null || recyclerView.getChildCount() == 0) ?
                        0 : mRecyclerView.getChildAt(0).getTop();
                mSwipeRefreshLayout.setEnabled((topRowVerticalPosition >= 0));
            }
        });
        headerBar.setVisibility(View.VISIBLE);

        mSwipeRefreshLayout.setOnRefreshListener(this);


        btnNxt.setOnClickListener(this);
        btnPrevious.setOnClickListener(this);
        txtCurrent.setOnClickListener(this);
        currentDate=DateFormater.getDateFromString(extraDate);
        getTimeSheetDetail(currentDate);
    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.timesheet_detail));
    }

    private void getTimeSheetDetail(Date date) {

        String displayTime = getDisplayTime(date);
        Date todayDate = getTodayDate();
        if (compareDateOnly(date, todayDate))
            txtCurrent.setText("Today");
        else
            txtCurrent.setText(displayTime);
        DialogClass.showDialog(this, this.getString(R.string.please_wait));
        String apiDate = getApiDate(date);
       
        mActionsListener.getTimeSheetDetail(apiDate);
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

    @OnClick(R.id.rightButton)
    public void openMap(){
        Intent intent = new Intent(this, BaseMapsActivity.class);
        startActivity(intent);
    }

    @Override
    public void onRefresh() {
        getTimeSheetDetail(currentDate);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnNxt:
                currentDate = nextDate(currentDate);
                getTimeSheetDetail(currentDate);
                break;
            case R.id.btnPre:
                currentDate = previousDate(currentDate);
                getTimeSheetDetail(currentDate);
                break;
            case R.id.txtCurrent:
                showDatePickerDialog();
                break;

        }

    }

    public Date nextDate(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, 1); //minus number would decrement the days
        return cal.getTime();
    }

    public Date previousDate(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, -1); //minus number would decrement the days
        return cal.getTime();
    }


    public void showDatePickerDialog() {
        DatePickerFragment newFragment = new DatePickerFragment();
        newFragment.setListener(datePicerInterface,currentDate);
        newFragment.show(this.getSupportFragmentManager(), "datePicker");
    }


    DatePickerInterface datePicerInterface = new DatePickerInterface() {
        @Override
        public void onDateUpdate(Date date) {
            currentDate = date;
            getTimeSheetDetail(currentDate);
        }
    };
    

    @Override
    public void onTimeSheetDetailDone(TimeSheetDetailResponse response, NicbitException e) {
        DialogClass.dismissDialog(this);
        mSwipeRefreshLayout.setRefreshing(false);
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                updateAdapter(response.getData());

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), this);
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    private void updateAdapter(List<TimeSheetDetailItem> list) {
        if (list.size() == 0) {
            timeSheetDetailListAdapter.clearAll();
            mRecyclerView.setEmptyView(mEmptyView);
        }else{
            timeSheetDetailListAdapter.addAll(list);
        }
        mSwipeRefreshLayout.setRefreshing(false);
    }
}
