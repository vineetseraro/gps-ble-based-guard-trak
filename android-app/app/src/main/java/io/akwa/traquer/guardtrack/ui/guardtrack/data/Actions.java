package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Actions {

@SerializedName("_id")
@Expose
private String id;
@SerializedName("action")
@Expose
private Action action;

public String getId() {
return id;
}

public void setId(String id) {
this.id = id;
}

public Action getAction() {
return action;
}

public void setAction(Action action) {
this.action = action;
}

}