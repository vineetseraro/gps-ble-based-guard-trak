package io.akwa.traquer.guardtrack.ui.guardtrack.history.tour;


import java.util.Map;

import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.ScanUpdateListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskListListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStartListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStopListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TourListListener;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.UpdateTaskDetailRequestListener;

public class TourDetailPresenter implements TourDetailContract.UserActionsListener,TourListListener,TaskListListener{

    private final TourDetailContract.View mView;

    public TourDetailPresenter(TourDetailContract.View mView) {
        this.mView = mView;
    }


    @Override
    public void onTourResponse(TourApiResponse response, NicbitException e) {
        mView.onTourList(response,e);

    }

    @Override
    public void getTour(int offset, int limit, String sort, String toruID) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTourListListener(this);
        apiHandler.getTous(offset,limit,sort,toruID);
    }

    @Override
    public void getTours() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTaskListListener(this);
        apiHandler.getTourss();
    }

    @Override
    public void onTasksResponseListener(TaskListApiResponse response, NicbitException e) {
        mView.onTours(response,e);
    }
}
