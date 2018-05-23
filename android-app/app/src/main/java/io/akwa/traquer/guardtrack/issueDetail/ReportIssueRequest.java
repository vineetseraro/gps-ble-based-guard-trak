package io.akwa.traquer.guardtrack.issueDetail;



import java.util.ArrayList;
import java.util.List;

import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryImage;

public class ReportIssueRequest {


    private double lat;
    private double lng;

    private String caseNo;
    private String shippingNo;
    private String comment;
    private String tourId;
    private String skuId;
    private long ts ;
    private String skuIds;
    private String did;

    public void setDid(String did) {
        this.did = did;
    }

    public void setTs(long ts) {
        this.ts = ts;
    }

    private List<CloudinaryImage> images = new ArrayList<>();

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLog() {
        return lng;
    }

    public void setLog(double lng) {
        this.lng = lng;
    }

    public String getTourId() {
        return tourId;
    }

    public void setTourId(String tourId) {
        this.tourId = tourId;
    }

    public String getSkuId() {
        return skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public String getSkuIds() {
        return skuIds;
    }

    public void setSkuIds(String skuIds) {
        this.skuIds = skuIds;
    }

    /**
     * @return The caseNo
     */
    public String getCaseNo() {
        return caseNo;
    }

    /**
     * @param caseNo The caseNo
     */
    public void setCaseNo(String caseNo) {
        this.caseNo = caseNo;
    }

    /**
     * @return The shippingNo
     */
    public String getShippingNo() {
        return shippingNo;
    }

    /**
     * @param shippingNo The shippingNo
     */
    public void setShippingNo(String shippingNo) {
        this.shippingNo = shippingNo;
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

    /**
     * @return The images
     */
    public List<CloudinaryImage> getImages() {
        return images;
    }

    /**
     * @param images The images
     */
    public void setImages(List<CloudinaryImage> images) {
        this.images = images;
    }

}