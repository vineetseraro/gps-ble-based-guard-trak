package io.akwa.traquer.guardtrack.ui.timeSheetReport;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.DatePicker;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportItem;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportResponse;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class TimeSheetReportActivity extends BaseActivity implements TimeSheetReportContract.View, SwipeRefreshLayout.OnRefreshListener, View.OnClickListener {

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

    @BindView(R.id.tvFromDate)
    TextView fromDate;
    @BindView(R.id.tvToDate)
    TextView toDate;

    @BindView(R.id.btn_submit)
    TextView btn_submit;

    private TimeSheetReportPresenter mActionsListener;
    private TimeSheetReportListAdapter timeSheetReportListAdapter;
    Calendar myCalendar;
    private DatePickerDialog datePickerDialog;
    DatePickerDialog.OnDateSetListener dateListener;
    boolean isFrom = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_timesheet_report);
        ButterKnife.bind(this);
        mActionsListener = new TimeSheetReportPresenter(this);
        setupActionBar();

        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(this));

        mSwipeRefreshLayout.setOnRefreshListener(this);

        timeSheetReportListAdapter = new TimeSheetReportListAdapter(this, new ArrayList<TimeSheetReportItem>());
        mRecyclerView.setAdapter(timeSheetReportListAdapter);
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


        mSwipeRefreshLayout.setOnRefreshListener(this);

        toDate.setOnClickListener(this);
        fromDate.setOnClickListener(this);
        btn_submit.setOnClickListener(this);
        myCalendar = Calendar.getInstance();
        updateDate(true);
        dateListener = new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear,
                                  int dayOfMonth) {
                // TODO Auto-generated method stub
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                updateDate(false);
//                if(isFrom){
//                    to.performClick();
//
            }

        };

        datePickerDialog=new DatePickerDialog(this, dateListener, myCalendar
                .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                myCalendar.get(Calendar.DAY_OF_MONTH));


    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.timesheet_history));
    }

    private void getTimeSheetDetail() {
        DialogClass.showDialog(this, this.getString(R.string.please_wait));
        mActionsListener.getTimeSheetReport(fromDate.getText().toString(),toDate.getText().toString());
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
    public void onRefresh() {
        getTimeSheetDetail();
    }



    @Override
    public void onTimeSheetReportDone(TimeSheetReportResponse response, NicbitException e) {
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

    private void updateAdapter(List<TimeSheetReportItem> list) {
        if (list.size() == 0) {
            timeSheetReportListAdapter.clearAll();
            mRecyclerView.setEmptyView(mEmptyView);
        } else {
            timeSheetReportListAdapter.addAll(list);
        }
        mSwipeRefreshLayout.setRefreshing(false);
    }

    private void updateDate(boolean current) {

        String dateText = DateFormater.apiDateFormat.format(myCalendar.getTime());
        if(current){
            toDate.setText(dateText);
            fromDate.setText(dateText);
        }else {
            if (isFrom) {
                fromDate.setText(dateText);
            } else {
                toDate.setText(dateText);
            }
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.tvFromDate:{
                isFrom = true;
                setDatePicker(false);
                break;
            }

            case R.id.tvToDate:{
                isFrom = false;
                setDatePicker(true);
                break;
            }

            case R.id.btn_submit:{
                getTimeSheetDetail();
                break;
            }

        }
    }

    private void setDatePicker(boolean setMinDate) {
        long now = System.currentTimeMillis() - 1000;
        DatePicker datePicker = datePickerDialog.getDatePicker();
        Date date = DateFormater.getDate(isFrom?fromDate.getText().toString():toDate.getText().toString());
        myCalendar.setTime(date);
        datePicker.updateDate(myCalendar
                        .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                myCalendar.get(Calendar.DAY_OF_MONTH));
        datePicker.setMaxDate(now);

        if(setMinDate){
            date = DateFormater.getDate(fromDate.getText().toString());
            myCalendar.setTime(date);
            datePicker.setMinDate(date.getTime());
        }else{
            datePicker.setMinDate(0L);
        }
        datePickerDialog.show();

    }
}
