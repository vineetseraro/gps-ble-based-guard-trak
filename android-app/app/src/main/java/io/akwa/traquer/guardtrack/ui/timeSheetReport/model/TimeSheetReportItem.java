package io.akwa.traquer.guardtrack.ui.timeSheetReport.model;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class TimeSheetReportItem {

    String firstIn;
    String lastOut;
    String date;
    long totalIn;

    public String getFirstIn() {
        return firstIn;
    }

    public void setFirstIn(String firstIn) {
        this.firstIn = firstIn;
    }

    public String getLastOut() {
        return lastOut;
    }

    public void setLastOut(String lastOut) {
        this.lastOut = lastOut;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getTotalIn() {
        return totalIn;
    }

    public void setTotalIn(long totalIn) {
        this.totalIn = totalIn;
    }
}
