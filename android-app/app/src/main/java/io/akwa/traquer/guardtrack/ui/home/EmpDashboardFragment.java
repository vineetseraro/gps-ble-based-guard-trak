package io.akwa.traquer.guardtrack.ui.home;

import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.BottomSheetBehavior;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.AppLog;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.home.model.DatePickerInterface;
import io.akwa.traquer.guardtrack.ui.home.model.EmpDashboardResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.TaskDetailActivity;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailItem;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.TimeSheetDetailActivity;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;
import io.akwa.traquer.guardtrack.ui.view.SpaceItemDecoration;

import static io.akwa.traquer.guardtrack.common.utils.DateFormater.compareDateOnly;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getApiDate;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getDisplayTime;
import static io.akwa.traquer.guardtrack.common.utils.DateFormater.getTodayDate;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class EmpDashboardFragment extends Fragment implements EmpHomeContract.View, SwipeRefreshLayout.OnRefreshListener, View.OnClickListener, TaskListAdapter.ItemClickListener {

    @BindView(R.id.btnNxt)
    ImageButton btnNxt;

    @BindView(R.id.btnPre)
    ImageButton btnPrevious;

    @BindView(R.id.tv_time)
    TextView tvTime;

    @BindView(R.id.headerBar)
    RelativeLayout headerBar;

    @BindView(R.id.itemSheet)
    LinearLayout itemSheetView;

    @BindView(R.id.txtCurrent)
    TextView txtCurrent;

    @BindView(R.id.imgArrow)
    ImageView imgArrow;

    @BindView(R.id.itemHeaderView)
    RelativeLayout itemHeaderView;

    @BindView(R.id.lstItem)
    EmptyRecyclerView listItemDetails;

    @BindView(R.id.tv_empty_view)
    TextView mEmptyView;

//    int peekHeight = 120;


    @BindView(R.id.swipeRefreshLayout)
    SwipeRefreshLayout mSwipeRefreshLayout;

    private DashboardHomePresenter mActionsListener;
    Date currentDate = null;
    public static boolean isRefresh;
    private BottomSheetBehavior itemSheet;
    boolean configure = false;
    private TaskListAdapter taskListAdapter;
    private String apiDate;


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActionsListener = new DashboardHomePresenter(this);
    }

    public void getDashboardData(Date date) {
        String displayTime = getDisplayTime(date);
        Date todayDate = getTodayDate();
        if (compareDateOnly(date, todayDate))
            txtCurrent.setText("Today");
        else
            txtCurrent.setText(displayTime);
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        apiDate = getApiDate(date);
        mActionsListener.getDashboard(apiDate);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.emp_dashboard_layout, container, false);
        ButterKnife.bind(this, view);
        headerBar.setVisibility(View.VISIBLE);

        mSwipeRefreshLayout.setOnRefreshListener(this);


        btnNxt.setOnClickListener(this);
        btnPrevious.setOnClickListener(this);
        txtCurrent.setOnClickListener(this);
        currentDate = getTodayDate();
        getDashboardData(currentDate);
        isRefresh = false;
        configureBottomSheet();
//        itemSheet.setPeekHeight(0);


        return view;
    }

    public void setItemList(ArrayList<TaskDetailItem> itemsList) {
        listItemDetails.setLayoutManager(new LinearLayoutManager(getActivity()));
        taskListAdapter = new TaskListAdapter(getActivity(), new ArrayList<TaskDetailItem>(), this);
        listItemDetails.setAdapter(taskListAdapter);
        listItemDetails.addItemDecoration(new SpaceItemDecoration(10));

        listItemDetails.setEmptyView(mEmptyView);

        if (itemsList != null)
            taskListAdapter.addAll(itemsList);
    }

    @OnClick(R.id.tv_time)
    public void goToDetail()
    {

        Intent intent = new Intent(getActivity(), TimeSheetDetailActivity.class);
        intent.putExtra(StringUtils.DATE,apiDate);
        startActivity(intent);

    }

    @OnClick(R.id.imgArrow)
    public void onItemSheetClick()
    {
        if(itemSheet.getState()==BottomSheetBehavior.STATE_COLLAPSED)
        {
            itemSheet.setState(BottomSheetBehavior.STATE_EXPANDED);

        }
        else if(itemSheet.getState()==BottomSheetBehavior.STATE_EXPANDED){

            itemSheet.setState(BottomSheetBehavior.STATE_COLLAPSED);

        }

    }
    public void configureBottomSheet() {


//        if (configure) {
//            ViewGroup.LayoutParams params = transparentLayout.getLayoutParams();
//            params.height = dpToPx(40);
//            transparentLayout.setLayoutParams(params);
//        }



        itemSheet = BottomSheetBehavior.from(itemSheetView);
//        itemSheet.setState(BottomSheetBehavior.STATE_COLLAPSED);

//        itemSheet.setPeekHeight(dpToPx(peekHeight));
        itemSheet.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(final View bottomSheet, int newState) {

                if (newState == BottomSheetBehavior.STATE_COLLAPSED) {
//                    itemSheet.setPeekHeight(dpToPx(peekHeight));
                    imgArrow.setImageResource(R.drawable.arrow_grey_up);


                } else if (newState == BottomSheetBehavior.STATE_EXPANDED) {
                    imgArrow.setImageResource(R.drawable.arrow_grey_down);
                }


            }

            @Override
            public void onSlide(View bottomSheet, float slideOffset) {
            }
        });


        itemHeaderView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (itemSheet.getState() == BottomSheetBehavior.STATE_COLLAPSED)
                    itemSheet.setState(BottomSheetBehavior.STATE_EXPANDED);
                else
                    itemSheet.setState(BottomSheetBehavior.STATE_EXPANDED);
            }
        });
    }

    public int dpToPx(int dp) {

        Resources r = getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return (int) px;

    }

    @Override
    public void onLogoutDone(ApiResponseModel loginResponse, NicbitException e) {

    }

    @Override
    public void onDashboardDone(EmpDashboardResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        mSwipeRefreshLayout.setRefreshing(false);
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
//                DialogClass.alerDialog(getActivity(), response.getDescription());
                long totalIn = response.getData().getTotalIn();
                setItemList(response.getData().getTasks());
                String s = DateFormater.convertEpochToHMmSs(totalIn);

                tvTime.setText("Total In Time \n"+s);

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }



    @Override
    public void onRefresh() {
        getDashboardData(currentDate);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnNxt:
                currentDate = nextDate(currentDate);
                getDashboardData(currentDate);
                break;
            case R.id.btnPre:
                currentDate = previousDate(currentDate);
                getDashboardData(currentDate);
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
        newFragment.show(getActivity().getSupportFragmentManager(), "datePicker");
    }


    DatePickerInterface datePicerInterface = new DatePickerInterface() {
        @Override
        public void onDateUpdate(Date date) {
            currentDate = date;
            getDashboardData(currentDate);
        }
    };

    @Override
    public void onItemClicked(TaskDetailItem task) {
        AppLog.i("click------");
        Intent intent = new Intent(getActivity(),   TaskDetailActivity.class);
        intent.putExtra(StringUtils.ITEM_ID, task.getId());
        startActivity(intent);

    }
}
