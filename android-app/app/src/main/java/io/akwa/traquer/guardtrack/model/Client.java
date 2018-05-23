package io.akwa.traquer.guardtrack.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by rohitkumar on 7/12/17.
 */

public class Client {
    @SerializedName("clientId")
    @Expose
    private String clientId;
    @SerializedName("projectId")
    @Expose
    private String projectId;

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}