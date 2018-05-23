package io.akwa.traquer.guardtrack.ui.timeSheetReport;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportResponse;

public class TimeSheetReportContract {
   public interface View {

        void onTimeSheetReportDone(TimeSheetReportResponse response, NicbitException e);
   }

    interface UserActionsListener {
        void getTimeSheetReport(String fromDate,String toDate);

    }
}
