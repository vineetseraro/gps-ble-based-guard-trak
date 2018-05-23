package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Action {

@SerializedName("actionType")
@Expose
private String actionType;
@SerializedName("actionDate")
@Expose
private String actionDate;

public String getActionType() {
return actionType;
}

public void setActionType(String actionType) {
this.actionType = actionType;
}

public String getActionDate() {
return actionDate;
}

public void setActionDate(String actionDate) {
this.actionDate = actionDate;
}

}