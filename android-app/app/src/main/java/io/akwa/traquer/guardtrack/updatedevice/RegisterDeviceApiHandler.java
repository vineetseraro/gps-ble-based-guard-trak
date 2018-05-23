package io.akwa.traquer.guardtrack.updatedevice;



import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInfo;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;

public class RegisterDeviceApiHandler implements  RegisterUpdateDevicePresneter.UserActionsListener,DeviceRegisterListener {
    private final RegisterUpdateDevicePresneter.View mCaseView;

    public RegisterDeviceApiHandler(RegisterUpdateDevicePresneter.View mCaseView) {
        this.mCaseView = mCaseView;
    }


    @Override
    public void deviceUpdate(DeviceInfo deviceInfor) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setDeviceRegisterListener(this);
        apiHandler.registerDevice(deviceInfor);

    }

    @Override
    public void onDeviceUpdate(ApiBaseResponse response, NicbitException e) {
        mCaseView.onDeviceUpdate(response,e);

    }

}

