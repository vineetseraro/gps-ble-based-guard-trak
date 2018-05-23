package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by rohitkumar on 1/16/18.
 */

public class TourData {

    @SerializedName("id")
    @Expose
    private String id;
    @SerializedName("task")
    @Expose
    private Task task;
    @SerializedName("tour")
    @Expose
    private Tour tour;
    @SerializedName("attendee")
    @Expose
    private Attendee attendee;
    @SerializedName("action")
    @Expose
    private Action action;
    @SerializedName("location")
    @Expose
    private Location location;
    @SerializedName("additionalInfo")
    @Expose
    private AdditionalInfo additionalInfo;
    @SerializedName("updatedOn")
    @Expose
    private String updatedOn;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public Attendee getAttendee() {
        return attendee;
    }

    public void setAttendee(Attendee attendee) {
        this.attendee = attendee;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public AdditionalInfo getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(AdditionalInfo additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

}
