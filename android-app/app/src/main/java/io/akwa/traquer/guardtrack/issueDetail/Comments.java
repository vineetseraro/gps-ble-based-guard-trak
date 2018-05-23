package io.akwa.traquer.guardtrack.issueDetail;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Comments {


    @SerializedName("commentDate")
    @Expose
    private String commentDate;
    @SerializedName("issueComments")
    @Expose
    private List<ItemComments> issueComments = new ArrayList<>();

    @SerializedName("itemComments")
    @Expose
    private List<ItemComments> itemComments = new ArrayList<>();


    public List<ItemComments> getIssueComments() {
        return issueComments;
    }

    public void setIssueComments(List<ItemComments> issueComments) {
        this.issueComments = issueComments;
    }


    public List<ItemComments> getItemComments() {
        return itemComments;
    }

    public void setItemComments(List<ItemComments> itemComments) {
        this.itemComments = itemComments;
    }

    /**
     * @return The commentDate
     */
    public String getCommentDate() {
        return commentDate;
    }

    /**
     * @param commentDate The commentDate
     */
    public void setCommentDate(String commentDate) {
        this.commentDate = commentDate;
    }

}
