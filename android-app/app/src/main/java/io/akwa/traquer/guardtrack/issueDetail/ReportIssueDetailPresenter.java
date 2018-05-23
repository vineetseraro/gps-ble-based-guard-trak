package io.akwa.traquer.guardtrack.issueDetail;


import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public class ReportIssueDetailPresenter implements ReportIssueDetailContract.UserActionsListener, PostCommentResponseListener, ReportIssueCommentsResponseListener {
    private final ReportIssueDetailContract.View mView;


    public ReportIssueDetailPresenter(ReportIssueDetailContract.View mView) {
        this.mView = mView;
    }

    @Override
    public void postIssueComment(PostIssueComment postIssueComment) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
       /* apiHandler.setPostCommentResposeListener(this);
        apiHandler.postIssueComment(postIssueComment);*/
    }

    @Override
    public void getIssueComments(String caseNo, String shippingNo, String issueId) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
      /*  apiHandler.setReportIssueCommentsResponseListener(this);
        apiHandler.getIssueComments(caseNo, shippingNo, issueId);*/
    }

    @Override
    public void onPostIssueCommentResponse(ApiResponseModel response, NicbitException e) {
        mView.onPostCommentResponseReceive(response, e);
    }

    @Override
    public void onIssueCommentsResponse(ApiResponseModel response, NicbitException e) {
        mView.onIssueCommentsResponseReceive(response, e);
    }
}
