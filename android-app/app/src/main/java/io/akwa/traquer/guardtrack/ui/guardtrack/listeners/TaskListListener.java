package io.akwa.traquer.guardtrack.ui.guardtrack.listeners;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;

/**
 * Created by rohitkumar on 1/8/18.
 */

public interface TaskListListener {
    void onTasksResponseListener(TaskListApiResponse response, NicbitException e);

}
