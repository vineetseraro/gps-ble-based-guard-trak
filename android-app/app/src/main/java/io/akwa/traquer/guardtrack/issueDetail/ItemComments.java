package io.akwa.traquer.guardtrack.issueDetail;

import java.util.ArrayList;
import java.util.List;

public class ItemComments {

    private Long itemId = null;


    private String l1;
    private String l2;
    private String l3;
    private String l4;
    private String l5;
    private String userProfilePicUrl;
    private Integer rtype;
    private Integer isReported;
    private List<ItemReportIssue> items;
    private List<IssueImage> issueImages = new ArrayList<>();
    private List<IssueImage> caseItemImages = new ArrayList<>();


    public List<IssueImage> getCaseItemImages() {
        return caseItemImages;
    }


    public List<ItemReportIssue> getItems() {
        return items;
    }

    public void setItems(List<ItemReportIssue> items) {
        this.items = items;
    }

    public void setCaseItemImages(List<IssueImage> caseItemImages) {
        this.caseItemImages = caseItemImages;
    }

    public String getUserProfilePicUrl() {
        return userProfilePicUrl;
    }

    public void setUserProfilePicUrl(String userProfilePicUrl) {
        this.userProfilePicUrl = userProfilePicUrl;
    }

    public String getL5() {
        return l5;
    }

    public void setL5(String l5) {
        this.l5 = l5;
    }

    public String getL4() {
        return l4;
    }

    public void setL4(String l4) {
        this.l4 = l4;
    }

    /**
     * @return The l1
     */
    public String getL1() {
        return l1;
    }

    /**
     * @param l1 The l1
     */
    public void setL1(String l1) {
        this.l1 = l1;
    }

    /**
     * @return The l2
     */
    public String getL2() {
        return l2;
    }

    /**
     * @param l2 The l2
     */
    public void setL2(String l2) {
        this.l2 = l2;
    }

    /**
     * @return The l3
     */
    public String getL3() {
        return l3;
    }

    /**
     * @param l3 The l3
     */
    public void setL3(String l3) {
        this.l3 = l3;
    }

    /**
     * @return The rtype
     */
    public Integer getRtype() {
        return rtype;
    }

    /**
     * @param rtype The rtype
     */
    public void setRtype(Integer rtype) {
        this.rtype = rtype;
    }

    /**
     * @return The issueImages
     */
    public List<IssueImage> getIssueImages() {
        return issueImages;
    }

    /**
     * @param issueImages The issueImages
     */
    public void setIssueImages(List<IssueImage> issueImages) {
        this.issueImages = issueImages;
    }

    /**
     * @return The isReported
     */
    public Integer getIsReported() {
        return isReported;
    }

    /**
     * @param isReported The isReported
     */
    public void setIsReported(Integer isReported) {
        this.isReported = isReported;
    }

    public long getItemId() {
        return itemId;
    }

    public void setItemId(long itemId) {
        this.itemId = itemId;
    }
}