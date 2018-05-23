package io.akwa.traquer.guardtrack.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import java.util.List;

/**
 * Created by rohitkumar on 10/5/17.
 */

public class NotificationApiResponse extends BaseResponse{

    @SerializedName("data")
    @Expose
    private List<ReaderGetNotificationsResponse> readerGetNotificationsResponses;

    public List<ReaderGetNotificationsResponse> getReaderGetNotificationsResponses() {
        return readerGetNotificationsResponses;
    }

    public void setReaderGetNotificationsResponses(List<ReaderGetNotificationsResponse> readerGetNotificationsResponses) {
        this.readerGetNotificationsResponses = readerGetNotificationsResponses;
    }
}
