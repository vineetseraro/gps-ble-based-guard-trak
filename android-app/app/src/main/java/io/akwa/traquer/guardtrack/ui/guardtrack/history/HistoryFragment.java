package io.akwa.traquer.guardtrack.ui.guardtrack.history;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.LocationBluetoothPermissionUtility;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.Data;
import io.akwa.traquer.guardtrack.model.NewParams;
import io.akwa.traquer.guardtrack.model.NotificationApiResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetNotificationsResponse;
import io.akwa.traquer.guardtrack.model.RemoveNotificationRequest;
import io.akwa.traquer.guardtrack.ui.adapter.NavigationDrawerAdapter;
import io.akwa.traquer.guardtrack.ui.guardtrack.GuardTaskDetailContract;
import io.akwa.traquer.guardtrack.ui.guardtrack.GuardTaskDetailPresenter;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.history.tour.TourDetailContract;
import io.akwa.traquer.guardtrack.ui.guardtrack.history.tour.TourDetailPresenter;
import io.akwa.traquer.guardtrack.ui.guardtrack.history.tour.tour.TourActivity;
import io.akwa.traquer.guardtrack.ui.notification.NotificationContract;
import io.akwa.traquer.guardtrack.ui.notification.NotificationListAdapter;
import io.akwa.traquer.guardtrack.ui.notification.NotificationPresenter;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;




public class HistoryFragment extends Fragment implements  TourDetailContract.View, SwipeRefreshLayout.OnRefreshListener, NotificationListAdapter.NotificationListClickListener,HistoryAdapter.ItemClickListener {

    @BindView(R.id.notification_list)
    EmptyRecyclerView mRecyclerView;

    @BindView(R.id.tv_empty_view)
    LinearLayout mEmptyView;

   /* @BindView(R.id.swipeRefreshLayout)
    SwipeRefreshLayout mSwipeRefreshLayout;*/

    private HistoryAdapter mNotificationListAdapter;
    private LocationBluetoothPermissionUtility locationBluetoothPermissionUtility;
    private String notificationId;

    TourDetailPresenter apiHandler;



    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_history, container, false);
        ButterKnife.bind(this, view);
        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstance) {
        super.onViewCreated(view, savedInstance);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(getActivity()));

        //mSwipeRefreshLayout.setOnRefreshListener(this);
        apiHandler = new TourDetailPresenter(this);
        mNotificationListAdapter = new HistoryAdapter(getActivity(),new ArrayList<Datum>(),this);
        mRecyclerView.setAdapter(mNotificationListAdapter);
      /*  mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                int topRowVerticalPosition = (recyclerView == null || recyclerView.getChildCount() == 0) ?
                        0 : mRecyclerView.getChildAt(0).getTop();
               // mSwipeRefreshLayout.setEnabled((topRowVerticalPosition >= 0));
            }
        });*/
       getTask();
    }

    public void getTask()
    {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        apiHandler.getTours();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (locationBluetoothPermissionUtility != null) {
            locationBluetoothPermissionUtility.onActivityResult(requestCode, resultCode, data);
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    private void updateAdapter(List<Datum> list) {
        if (list.size() == 0) {
            mRecyclerView.setEmptyView(mEmptyView);
        }else{
            mNotificationListAdapter.addAll(list);
        }
       // mSwipeRefreshLayout.setRefreshing(false);
    }

    @Override
    public void onRefresh() {
      //  getTask();
    }


    private void stopRefresh() {
        //mSwipeRefreshLayout.setRefreshing(false);
        mRecyclerView.setEmptyView(mEmptyView);
    }


    @Override
    public void onNotificationClicked(ReaderGetNotificationsResponse data) {

        final NewParams params = data.getParams();
        String notificationType = data.getNotificationType();
        locationBluetoothPermissionUtility = new LocationBluetoothPermissionUtility(getActivity());
        locationBluetoothPermissionUtility.setLocationListener(new LocationBluetoothPermissionUtility.LocationBluetoothListener() {
            @Override
            public void onLocationON() {
                if(params.getServiceType()==2)
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
            }

            @Override
            public void onLocationOFF() {
                if(params.getServiceType()==2)
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
            }

            @Override
            public void onBluetoothON() {

            }

            @Override
            public void onBluetoothOFF() {

            }
        });


        switch (notificationType) {
            case Constant.NotificationType.GPSBluetoothDown:
                if (params.getServiceType() == 0) {
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
                } else if (params.getServiceType() == 1) {
                    locationBluetoothPermissionUtility.checkLocationOnOff();

                } else {
                    locationBluetoothPermissionUtility.checkLocationOnOff();


                }
                break;

        }
    }

    @Override
    public void removeNotificationClicked(String notification) {
        this.notificationId = notification;
      /*  NotificationData notificationData = new NotificationData();
        notificationData.setNotificationId(notification);*/
        ArrayList<String> notificationDatas = new ArrayList<>();
        notificationDatas.add(notification);
        removeNotification(notificationDatas, false);
    }

    public void removeNotification(ArrayList<String> notificationIdList, boolean removeAll) {
        RemoveNotificationRequest removeNotificationRequest = new RemoveNotificationRequest();
        removeNotificationRequest.setDeleteAll(removeAll);
        removeNotificationRequest.setNotifications(notificationIdList);
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        //mActionsListener.removeNotifications(removeNotificationRequest);
    }

    public void removeAll() {
        removeNotification(null,true);
        //mNotificationListAdapter.clearAll();
    }


    @Override
    public void onItemClicked(Datum data) {

        Intent intent=new Intent(getActivity(), TourActivity.class);
        intent.putExtra("tourId",data.getId());
        startActivity(intent);

    }

    @Override
    public void onTourList(TourApiResponse response, NicbitException e) {

    }

    @Override
    public void onTours(TaskListApiResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() == 200) {
                List<Datum> data = response.getData();
                if (data != null) {
                    updateAdapter(data);
                }
            } else if (response.getCode() == 209) {

            } else {
                stopRefresh();
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            stopRefresh();
            DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }
}
