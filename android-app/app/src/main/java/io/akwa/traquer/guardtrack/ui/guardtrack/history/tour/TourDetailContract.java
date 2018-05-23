package io.akwa.traquer.guardtrack.ui.guardtrack.history.tour;


import java.util.Map;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourApiResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;

public class TourDetailContract {
    public interface View {

        void onTourList(TourApiResponse response, NicbitException e);
        void onTours(TaskListApiResponse response, NicbitException e);

    }

    interface UserActionsListener {
        void getTour(int offset,int limit,String sort,String toruID);
        void getTours();
    }
}
