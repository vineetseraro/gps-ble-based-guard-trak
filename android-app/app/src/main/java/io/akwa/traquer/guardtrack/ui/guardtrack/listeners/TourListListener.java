package io.akwa.traquer.guardtrack.ui.guardtrack.listeners;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourApiResponse;

/**
 * Created by rohitkumar on 1/8/18.
 */

public interface TourListListener {
    void onTourResponse(TourApiResponse response, NicbitException e);

}
