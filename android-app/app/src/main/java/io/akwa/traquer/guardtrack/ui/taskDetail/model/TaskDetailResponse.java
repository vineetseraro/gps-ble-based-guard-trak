package io.akwa.traquer.guardtrack.ui.taskDetail.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.akwa.traquer.guardtrack.model.BaseResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class TaskDetailResponse extends BaseResponse{


    @SerializedName("data")
    @Expose

    TaskDetailItem data;

    public TaskDetailItem getData() {
        return data;
    }

    public void setData(TaskDetailItem data) {
        this.data = data;
    }
}
