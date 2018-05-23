package io.akwa.traquer.guardtrack.ui.trackingsetting;


import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;
import io.akwa.traquer.guardtrack.ui.trackingsetting.model.UpdateTrackingSetting;


public class TrackingSettingPresenter implements TrackingSettingContract.UserActionsListener, UpdateTrackingSettingResponseListener, TrackingSettingResponseListener {
    private final TrackingSettingContract.View mSettingView;

    public TrackingSettingPresenter(TrackingSettingContract.View mSettingView) {
        this.mSettingView = mSettingView;
    }


    @Override
    public void getSettings() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTrackingSettingResponseListener(this);
        apiHandler.getTrackingSetting();

    }

    @Override
    public void updateSettings(UpdateTrackingSetting updateSettingsRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setUpdateTrackingSettingResponseListener(this);
        apiHandler.updateTrackingSetting(updateSettingsRequest);
    }

    @Override
    public void onUpdateSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e) {
        mSettingView.onUpdateSettingsResponseReceive(response, e);

    }

    @Override
    public void onSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e) {
        mSettingView.onGetSettingsResponseReceive(response, e);
    }


}
