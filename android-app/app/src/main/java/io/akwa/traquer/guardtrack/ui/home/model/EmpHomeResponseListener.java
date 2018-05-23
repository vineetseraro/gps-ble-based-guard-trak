package io.akwa.traquer.guardtrack.ui.home.model;

import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface EmpHomeResponseListener {
    void onDashboardResponseReceive(EmpDashboardResponse response, NicbitException e);
}
