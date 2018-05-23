package io.akwa.traquer.guardtrack.ui.home;



import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.home.model.EmpDashboardResponse;

public class EmpHomeContract {
   public interface View {
        void onLogoutDone(ApiResponseModel loginResponse, NicbitException e);
        void onDashboardDone(EmpDashboardResponse response, NicbitException e);
   }

    interface UserActionsListener {
        void getDashboard(String date);
        void doLogout();
    }
}
