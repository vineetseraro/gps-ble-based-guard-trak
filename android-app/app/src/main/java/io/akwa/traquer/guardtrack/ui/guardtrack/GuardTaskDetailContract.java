package io.akwa.traquer.guardtrack.ui.guardtrack;


import java.util.List;
import java.util.Map;
import java.util.Objects;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;

public class GuardTaskDetailContract {
    public interface View {

        void onTaskList(TaskListApiResponse response, NicbitException e);
        void onScanUpdate(ScanResponse response, NicbitException e);
        void onStartTask(TaskStartApiResponse response, NicbitException e);
        void onStopTask(TaskStopApiResponse response, NicbitException e);
        void onTaskDetailUpdated(ApiResponseModel response, NicbitException e);


    }

    interface UserActionsListener {
        void getTasks();
        void updateScan(ScanRequest scanRequest);
        void startTask(Map<String,Object> tarckId);
        void stopTask(Map<String,Object> tarckId);
        void updateTaskDetail(String taskId, TaskDetailUpdateRequest taskDetailUpdateRequest);

    }
}
