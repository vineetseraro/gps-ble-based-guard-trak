package io.akwa.traquer.guardtrack.issueDetail;

public class PostIssueComment {

    private String issueId;
    private String comment;

    /**
     * @return The issueId
     */
    public String getIssueId() {
        return issueId;
    }

    /**
     * @param issueId The issueId
     */
    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    /**
     * @return The comment
     */
    public String getComment() {
        return comment;
    }

    /**
     * @param comment The comment
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

}