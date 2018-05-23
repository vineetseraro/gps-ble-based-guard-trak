package io.akwa.traquer.guardtrack.issueDetail;

import java.util.ArrayList;
import java.util.List;

public class ReaderGetIssueCommentsResponse {

    private IssueCommentDetail caseDetails;

    private List<Comments> comments = new ArrayList<>();
    private List<ItemReportIssue> items = new ArrayList<>();

    public List<ItemReportIssue> getItems() {
        return items;
    }

    public void setItems(List<ItemReportIssue> items) {
        this.items = items;
    }

    public IssueCommentDetail getCaseDetails() {
        return caseDetails;
    }

    public void setCaseDetails(IssueCommentDetail caseDetails) {
        this.caseDetails = caseDetails;
    }

    /**
     * @return The comments
     */
    public List<Comments> getComments() {
        return comments;
    }

    /**
     * @param comments The comments
     */
    public void setComments(List<Comments> comments) {
        this.comments = comments;
    }

}