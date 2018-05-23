package io.akwa.aksync.network.model;

/**
 * Created by niteshgoel on 11/8/17.
 */

public class ApiNFCModel extends ApiSensorModel {

    private String uid;
    private String type="nfcTag";

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
