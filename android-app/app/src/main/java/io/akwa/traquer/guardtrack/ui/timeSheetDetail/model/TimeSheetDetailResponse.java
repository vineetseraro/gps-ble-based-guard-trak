package io.akwa.traquer.guardtrack.ui.timeSheetDetail.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

import io.akwa.traquer.guardtrack.model.BaseResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class TimeSheetDetailResponse extends BaseResponse{


    @SerializedName("data")
    @Expose

    List<TimeSheetDetailItem> data;

    public List<TimeSheetDetailItem> getData() {
        return data;
    }

    public void setData(List<TimeSheetDetailItem> data) {
        this.data = data;
    }
}
