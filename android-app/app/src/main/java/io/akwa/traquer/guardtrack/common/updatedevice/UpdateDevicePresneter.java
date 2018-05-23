package io.akwa.traquer.guardtrack.common.updatedevice;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public class UpdateDevicePresneter {


   public interface View {
        void onDeviceUpdate(ApiResponseModel response, NicbitException e);
    }

    public interface UserActionsListener {
        void deviceUpdate(DeviceInfo deviceInfor);
    }
}
