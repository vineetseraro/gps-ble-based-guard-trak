package io.akwa.traquer.guardtrack.issueDetail;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface ReportIssueDetailContract {
    interface View {

        void onIssueCommentsResponseReceive(ApiResponseModel response, NicbitException e);

        void onPostCommentResponseReceive(ApiResponseModel response, NicbitException e);
    }

    interface UserActionsListener {

        void postIssueComment(PostIssueComment postIssueComment);

        void getIssueComments(String caseNo, String shippingNo, String issueId);
    }
}
