package io.akwa.akcore;



public class ZoneBeacon {

private String id;

private String code;

private String name;

private String uuid;

private Integer major;

private Integer minor;

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