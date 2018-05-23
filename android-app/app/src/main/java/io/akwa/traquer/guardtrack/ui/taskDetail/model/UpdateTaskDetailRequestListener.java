package io.akwa.traquer.guardtrack.ui.taskDetail.model;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface UpdateTaskDetailRequestListener {
    void onTaskDetailUpdated(ApiResponseModel response, NicbitException e);
}
