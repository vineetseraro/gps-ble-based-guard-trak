package io.akwa.traquer.guardtrack.issueDetail;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface ReportShippingIssueResponseListener {
    void onReportShippingIssueResponse(ApiResponseModel response, NicbitException e);

}
