package io.akwa.traquer.guardtrack.ui.taskDetail.model;

import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface TaskDetailResponseListener {
    void onTaskDetailResponseReceive(TaskDetailResponse response, NicbitException e);
}
