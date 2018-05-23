package io.akwa.traquer.guardtrack.ui.timeSheetDetail;


import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponse;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponseListener;

public class TimeSheetDetailPresenter implements TimeSheetDetailContract.UserActionsListener,TimeSheetDetailResponseListener {

    private final TimeSheetDetailContract.View mView;

    public TimeSheetDetailPresenter(TimeSheetDetailContract.View mView) {
        this.mView = mView;
    }

    @Override
    public void onTimeSheetDetailResponseReceive(TimeSheetDetailResponse response, NicbitException e) {
        mView.onTimeSheetDetailDone(response,e);
    }

    @Override
    public void getTimeSheetDetail(String date) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setTimeSheetDetailResponseListener(this);
        apiHandler.getTimeSheetDetail(date);
    }
}
