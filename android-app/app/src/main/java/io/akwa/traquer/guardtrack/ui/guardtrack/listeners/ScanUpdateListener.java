package io.akwa.traquer.guardtrack.ui.guardtrack.listeners;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;

/**
 * Created by rohitkumar on 1/10/18.
 */

public interface ScanUpdateListener {

    void onScanUpdate(ScanResponse response, NicbitException e);

}
