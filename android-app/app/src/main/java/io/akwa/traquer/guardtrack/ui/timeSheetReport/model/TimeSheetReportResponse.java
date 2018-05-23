package io.akwa.traquer.guardtrack.ui.timeSheetReport.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

import io.akwa.traquer.guardtrack.model.BaseResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class TimeSheetReportResponse extends BaseResponse{


    @SerializedName("data")
    @Expose

    List<TimeSheetReportItem> data;

    public List<TimeSheetReportItem> getData() {
        return data;
    }

    public void setData(List<TimeSheetReportItem> data) {
        this.data = data;
    }
}
