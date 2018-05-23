package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Sensor {

@SerializedName("type")
@Expose
private String type="";
@SerializedName("uid")
@Expose
private String uid="";

public String getType() {
return type;
}

public void setType(String type) {
this.type = type;
}

public String getUid() {
return uid;
}

public void setUid(String uid) {
this.uid = uid;
}

}