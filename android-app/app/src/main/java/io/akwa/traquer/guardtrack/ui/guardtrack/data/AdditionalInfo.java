package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class AdditionalInfo {

@SerializedName("tourId")
@Expose
private String tourId="";
@SerializedName("sessionToken")
@Expose
private String sessionToken="";

public String getTourId() {
return tourId;
}

public void setTourId(String tourId) {
this.tourId = tourId;
}

public String getSessionToken() {
return sessionToken;
}

public void setSessionToken(String sessionToken) {
this.sessionToken = sessionToken;
}

}