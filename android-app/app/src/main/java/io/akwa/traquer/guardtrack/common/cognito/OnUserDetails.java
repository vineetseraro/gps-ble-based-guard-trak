package io.akwa.traquer.guardtrack.common.cognito;


import io.akwa.traquer.guardtrack.model.ReaderGetProfileResponse;

/**
 * Created by rohitkumar on 7/6/17.
 */

public interface OnUserDetails {
    public void onUserDetails(ReaderGetProfileResponse data, Exception exception);

}
