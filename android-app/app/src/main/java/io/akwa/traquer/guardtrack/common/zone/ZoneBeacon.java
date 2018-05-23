package io.akwa.traquer.guardtrack.common.zone;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.akwa.traquer.guardtrack.ui.guardtrack.data.Zone;

public class ZoneBeacon {

@SerializedName("id")
@Expose
private String id;
@SerializedName("code")
@Expose
private String code;
@SerializedName("name")
@Expose
private String name;
@SerializedName("uuid")
@Expose
private String uuid;
@SerializedName("major")
@Expose
private Integer major;
@SerializedName("minor")
@Expose
private Integer minor;
@SerializedName("zone")
@Expose
private Zone zone;

public String getId() {
return id;
}

public void setId(String id) {
this.id = id;
}

public String getCode() {
return code;
}

public void setCode(String code) {
this.code = code;
}

public String getName() {
return name;
}

public void setName(String name) {
this.name = name;
}

public String getUuid() {
return uuid;
}

public void setUuid(String uuid) {
this.uuid = uuid;
}

public Integer getMajor() {
return major;
}

public void setMajor(Integer major) {
this.major = major;
}

public Integer getMinor() {
return minor;
}

public void setMinor(Integer minor) {
this.minor = minor;
}

public Zone getZone() {
return zone;
}

public void setZone(Zone zone) {
this.zone = zone;
}

}