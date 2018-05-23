package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class TaskListApiResponse {

@SerializedName("code")
@Expose
private Integer code;
@SerializedName("message")
@Expose
private String message;
@SerializedName("description")
@Expose
private String description;
@SerializedName("totalRecords")
@Expose
private Integer totalRecords;
@SerializedName("recordsCount")
@Expose
private Integer recordsCount;
@SerializedName("data")
@Expose
private ArrayList<Datum> data = null;

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

public Integer getTotalRecords() {
return totalRecords;
}

public void setTotalRecords(Integer totalRecords) {
this.totalRecords = totalRecords;
}

public Integer getRecordsCount() {
return recordsCount;
}

public void setRecordsCount(Integer recordsCount) {
this.recordsCount = recordsCount;
}

public ArrayList<Datum> getData() {
return data;
}

public void setData(ArrayList<Datum> data) {
this.data = data;
}

}