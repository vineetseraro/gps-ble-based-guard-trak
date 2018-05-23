package io.akwa.traquer.guardtrack.ui.taskDetail;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;

public class TaskDetailContract {
    public interface View {

        void onTaskDetailDone(TaskDetailResponse response, NicbitException e);
        void onTaskDetailUpdated(ApiResponseModel response, NicbitException e);
    }

    interface UserActionsListener {
        void getTaskDetail(String taskId);
        void updateTaskDetail(String taskId,TaskDetailUpdateRequest taskDetailUpdateRequest);

    }
}
