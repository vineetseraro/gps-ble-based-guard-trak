package io.akwa.traquer.guardtrack.updatedevice;


import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInfo;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;

public class RegisterUpdateDevicePresneter {


   public interface View {
        void onDeviceUpdate(ApiBaseResponse response, NicbitException e);
    }

    public interface UserActionsListener {
        void deviceUpdate(DeviceInfo deviceInfor);
    }
}
