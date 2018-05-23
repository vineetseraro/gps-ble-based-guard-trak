package io.akwa.traquer.guardtrack.ui.timeSheetReport.model;

import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface TimeSheetReportResponseListener {
    void onTimeSheetReportResponseReceive(TimeSheetReportResponse response, NicbitException e);
}
