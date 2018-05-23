package io.akwa.traquer.guardtrack.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by rohitkumar on 7/12/17.
 */

public class DeviceRegisterResponse {

    @SerializedName("id")
    @Expose
    private String id;
    @SerializedName("deviceId")
    @Expose
    private String deviceId;
    @SerializedName("name")
    @Expose
    private String name;

    @SerializedName("code")
    @Expose
    private String code;


    @SerializedName("updatedOn")
    @Expose
    private String updatedOn;
    @SerializedName("client")
    @Expose
    private Client client;

    @SerializedName("os")
    @Expose
    private String os;
    @SerializedName("manufacturer")
    @Expose
    private String manufacturer;
    @SerializedName("model")
    @Expose
    private String model;
    @SerializedName("version")
    @Expose
    private String version;

    @SerializedName("uuid")
    @Expose
    private String uuid;

    @SerializedName("major")
    @Expose
    private int major;

    @SerializedName("minor")
    @Expose
    private int minor;


    public int getMajor() {
        return major;
    }

    public void setMajor(int major) {
        this.major = major;
    }

    public int getMinor() {
        return minor;
    }

    public void setMinor(int minor) {
        this.minor = minor;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }


    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

}
