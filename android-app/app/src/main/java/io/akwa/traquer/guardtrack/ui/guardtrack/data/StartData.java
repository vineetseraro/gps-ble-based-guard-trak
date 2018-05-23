package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class StartData {


    @SerializedName("id")
    @Expose
    private String id;

    @SerializedName("from")
    @Expose
    private String from;
    @SerializedName("to")
    @Expose
    private String to;
    @SerializedName("duration")
    @Expose
    private Integer duration;
    @SerializedName("task")
    @Expose
    private Task task;
    @SerializedName("updatedOn")
    @Expose
    private String updatedOn;
    @SerializedName("updatedBy")
    @Expose
    private String updatedBy;


    @SerializedName("tourId")
    @Expose
    private Integer tourId;
   /* @SerializedName("client")
    @Expose
    private Client client;
*/

    public Integer getTourId() {
        return tourId;
    }

    public void setTourId(Integer tourId) {
        this.tourId = tourId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

   /* public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }*/

}