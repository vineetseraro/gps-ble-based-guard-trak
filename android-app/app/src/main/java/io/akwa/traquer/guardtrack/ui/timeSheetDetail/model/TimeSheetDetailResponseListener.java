package io.akwa.traquer.guardtrack.ui.timeSheetDetail.model;

import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface TimeSheetDetailResponseListener {
    void onTimeSheetDetailResponseReceive(TimeSheetDetailResponse response, NicbitException e);
}
