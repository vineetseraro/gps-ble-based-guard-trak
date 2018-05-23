package io.akwa.traquer.guardtrack.ui.timeSheetDetail;



import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponse;

public class TimeSheetDetailContract {
   public interface View {

        void onTimeSheetDetailDone(TimeSheetDetailResponse response, NicbitException e);
   }

    interface UserActionsListener {
        void getTimeSheetDetail(String date);

    }
}
