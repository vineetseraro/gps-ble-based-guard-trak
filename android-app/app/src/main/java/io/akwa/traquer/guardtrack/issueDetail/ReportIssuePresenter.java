package io.akwa.traquer.guardtrack.issueDetail;


import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public class ReportIssuePresenter implements ReportIssueContract.UserActionsListener, ReportShippingIssueResponseListener {
    private final ReportIssueContract.View mView;

    public ReportIssuePresenter(ReportIssueContract.View mView) {
        this.mView = mView;
    }


    @Override
    public void reportShippingIssue(ReportIssueRequest reportIssueRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
      /*  apiHandler.setReportShippingIssueResponseListener(this);
        apiHandler.reportShippingIssue(reportIssueRequest);*/
    }

    @Override
    public void reportItemComment(ReportIssueRequest reportIssueRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setReportShippingIssueResponseListener(this);
        apiHandler.reportItemComment(reportIssueRequest);
    }

    @Override
    public void onReportShippingIssueResponse(ApiResponseModel response, NicbitException e) {
        mView.onReportIssueResponseReceive(response, e);
    }
}

