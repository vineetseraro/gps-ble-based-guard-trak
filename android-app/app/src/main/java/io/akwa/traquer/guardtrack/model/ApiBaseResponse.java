package io.akwa.traquer.guardtrack.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


/**
 * Created by rohitkumar on 7/12/17.
 */

public class ApiBaseResponse {

    @SerializedName("code")
    @Expose
    private Integer code;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("data")
    @Expose
    private DeviceRegisterResponse data;

    public DeviceRegisterResponse getData() {
        return data;
    }

    public void setData(DeviceRegisterResponse data) {
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
