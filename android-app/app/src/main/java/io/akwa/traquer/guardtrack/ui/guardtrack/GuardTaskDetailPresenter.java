package io.akwa.traquer.guardtrack.ui.guardtrack;


import java.util.Map;

import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.ScanUpdateListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskListListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStartListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStopListener;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponseListener;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.UpdateTaskDetailRequestListener;

public class GuardTaskDetailPresenter implements GuardTaskDetailContract.UserActionsListener,TaskListListener, UpdateTaskDetailRequestListener,TaskStartListener,TaskStopListener,ScanUpdateListener{

    private final GuardTaskDetailContract.View mView;

    public GuardTaskDetailPresenter(GuardTaskDetailContract.View mView) {
        this.mView = mView;
    }




    @Override
    public void getTasks() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTaskListListener(this);
        apiHandler.getTasks();
    }



    @Override
    public void updateScan(ScanRequest scanRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setScanUpdateListener(this);
        apiHandler.updateScan(scanRequest);
    }

    @Override
    public void startTask(Map<String, Object> tarckId) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTaskStartListener(this);
        apiHandler.startTask(tarckId);
    }

    @Override
    public void stopTask(Map<String, Object> tarckId) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTaskStopListener(this);
        apiHandler.stopTask(tarckId);
    }

    @Override
    public void updateTaskDetail(String taskId, TaskDetailUpdateRequest taskDetailUpdateRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setUpdateTaskDetailRequestListener(this);
        apiHandler.updateTaskDetail(taskId,taskDetailUpdateRequest);
    }

    @Override
    public void onTaskDetailUpdated(ApiResponseModel response, NicbitException e) {
        mView.onTaskDetailUpdated(response,e);
    }

    @Override
    public void onTasksResponseListener(TaskListApiResponse response, NicbitException e) {
        mView.onTaskList(response,e);
    }

    @Override
    public void onTaskStop(TaskStopApiResponse response, NicbitException e) {
        mView.onStopTask(response,e);
    }

    @Override
    public void onTaskStart(TaskStartApiResponse response, NicbitException e) {
        mView.onStartTask(response,e);
    }

    @Override
    public void onScanUpdate(ScanResponse response, NicbitException e) {
        mView.onScanUpdate(response,e);
    }
}
