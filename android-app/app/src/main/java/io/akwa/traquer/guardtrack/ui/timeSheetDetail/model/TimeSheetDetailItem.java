package io.akwa.traquer.guardtrack.ui.timeSheetDetail.model;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class TimeSheetDetailItem {

    String entryTime;
    String exitTime;
    String name;
    String type;

    public String getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(String entryTime) {
        this.entryTime = entryTime;
    }

    public String getExitTime() {
        return exitTime;
    }

    public void setExitTime(String exitTime) {
        this.exitTime = exitTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
