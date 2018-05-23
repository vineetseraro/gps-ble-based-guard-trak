package io.akwa.traquer.guardtrack.issueDetail;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface ReportIssueContract {
    interface View {

        void onReportIssueResponseReceive(ApiResponseModel response, NicbitException e);
    }

    interface UserActionsListener {

        void reportShippingIssue(ReportIssueRequest reportIssueRequest);

        void reportItemComment(ReportIssueRequest reportIssueRequest);
    }
}
