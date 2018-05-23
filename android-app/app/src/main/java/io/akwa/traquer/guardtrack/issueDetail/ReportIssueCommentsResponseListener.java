package io.akwa.traquer.guardtrack.issueDetail;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface ReportIssueCommentsResponseListener {
    void onIssueCommentsResponse(ApiResponseModel response, NicbitException e);
}
