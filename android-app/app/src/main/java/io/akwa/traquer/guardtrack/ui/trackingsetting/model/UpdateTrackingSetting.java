package io.akwa.traquer.guardtrack.ui.trackingsetting.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class UpdateTrackingSetting {


    @SerializedName("weekdays")
    @Expose
    private List<GetTrackingSettingResponse.Weekday> weekdays = null;
    @SerializedName("saturday")
    @Expose
    private List<GetTrackingSettingResponse.Saturday> saturday = null;
    @SerializedName("sunday")
    @Expose
    private List<GetTrackingSettingResponse.Sunday> sunday = null;

    public List<GetTrackingSettingResponse.Weekday> getWeekdays() {
        return weekdays;
    }

    public void setWeekdays(List<GetTrackingSettingResponse.Weekday> weekdays) {
        this.weekdays = weekdays;
    }

    public List<GetTrackingSettingResponse.Saturday> getSaturday() {
        return saturday;
    }

    public void setSaturday(List<GetTrackingSettingResponse.Saturday> saturday) {
        this.saturday = saturday;
    }

    public List<GetTrackingSettingResponse.Sunday> getSunday() {
        return sunday;
    }

    public void setSunday(List<GetTrackingSettingResponse.Sunday> sunday) {
        this.sunday = sunday;
    }
}
