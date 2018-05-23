package io.akwa.traquer.guardtrack.model;

/**
 * Created by rohitkumar on 10/5/17.
 */

public class NewParams {

    private String orderId;
    private String id;
    private Integer notificationType;
    private String shipmentId;
    private String issueId;
    private Integer serviceType;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getServiceType() {
        return serviceType;
    }

    public void setServiceType(Integer serviceType) {
        this.serviceType = serviceType;
    }

    /**
     *
     * @return
     * The notificationType
     */
    public Integer getNotificationType() {
        return notificationType;
    }

    /**
     *
     * @param notificationType
     * The notificationType
     */
    public void setNotificationType(Integer notificationType) {
        this.notificationType = notificationType;
    }

    /**
     *
     * @return
     * The caseId
     */
    public String getCaseId() {
        return orderId;
    }

    /**
     *
     * @param caseId
     * The caseId
     */
    public void setCaseId(String caseId) {
        this.orderId = orderId;
    }

    /**
     *
     * @return
     * The shippingNo
     */
    public String getShippingNo() {
        return shipmentId;
    }

    /**
     *
     * @param shippingNo
     * The shippingNo
     */
    public void setShippingNo(String shippingNo) {
        this.shipmentId = shippingNo;
    }

    /**
     *
     * @return
     * The issueId
     */
    public String getIssueId() {
        return issueId;
    }

    /**
     *
     * @param issueId
     * The issueId
     */
    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }


}
