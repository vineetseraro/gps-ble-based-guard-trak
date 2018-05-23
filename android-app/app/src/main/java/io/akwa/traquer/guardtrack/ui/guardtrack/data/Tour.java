package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Tour {

@SerializedName("id")
@Expose
private String id;
@SerializedName("tourId")
@Expose
private Integer tourId;
@SerializedName("name")
@Expose
private String name;

public String getId() {
return id;
}

public void setId(String id) {
this.id = id;
}

public Integer getTourId() {
return tourId;
}

public void setTourId(Integer tourId) {
this.tourId = tourId;
}

public String getName() {
return name;
}

public void setName(String name) {
this.name = name;
}

}