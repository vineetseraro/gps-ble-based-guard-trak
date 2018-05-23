package io.akwa.traquer.guardtrack.ui.home;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.FrameLayout;

import io.akwa.nfc.NFCActivity;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.akwa.aklogs.NBLogger;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.linkdevice.LinkUnlinkDeviceContract;
import io.akwa.traquer.guardtrack.common.linkdevice.LinkUnlinkDevicePresenter;
import io.akwa.traquer.guardtrack.common.login.LoginActivity;
import io.akwa.traquer.guardtrack.common.tracking.Tracker;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.LocationBluetoothPermissionUtility;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.ReaderGetSettingsResponse;
import io.akwa.traquer.guardtrack.ui.about.AboutActivity;
import io.akwa.traquer.guardtrack.ui.contactsettings.ContactSettingActivity;
import io.akwa.traquer.guardtrack.ui.guardtrack.GuardHomeFragment;
import io.akwa.traquer.guardtrack.ui.guardtrack.history.HistoryActivity;
import io.akwa.traquer.guardtrack.ui.help.HelpActivity;
import io.akwa.traquer.guardtrack.ui.map.UserMapActivity;
import io.akwa.traquer.guardtrack.ui.notification.NotificationActivity;
import io.akwa.traquer.guardtrack.ui.settings.SettingActivity;
import io.akwa.traquer.guardtrack.ui.settings.SettingContract;
import io.akwa.traquer.guardtrack.ui.settings.SettingPresenter;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.TimeSheetReportActivity;
import io.akwa.traquer.guardtrack.ui.trackingsetting.TrackingSettingActivity;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;


public class HomeActivity extends DefaultHomeActivity implements BaseActivity.CheckHomePagePermission,LinkUnlinkDeviceContract.View,SettingContract.View{

    public GuardHomeFragment caseListingFragment;
    @BindView(R.id.tab_layout)
    TabLayout mTabLayout;
    @BindView(R.id.container_body)
    FrameLayout mFrameLayout;


    private int REQUEST_SETTING = 1301;

    LinkUnlinkDeviceContract.UserActionsListener actionsListener;
    public SettingContract.UserActionsListener settingActionListener;



    String TAG = "HomeActivity";
    private LocationBluetoothPermissionUtility locationBluetoothPermissionUtility;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ButterKnife.bind(this);

        actionsListener=new LinkUnlinkDevicePresenter(this);
        caseListingFragment = new GuardHomeFragment();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.container_body, caseListingFragment, "caseList");
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
        startTracking();
        //call for Device Link

        if(!PrefUtils.isDeviceLinked()) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("appCode", PrefUtils.getCode());
            actionsListener.linkDevice(jsonObject);
        }

        settingActionListener= new SettingPresenter(this);
        if(!PrefUtils.getSettingFetched()) {
            DialogClass.showDialog(this, getString(R.string.please_wait));
            getSettings();
        }


    }


    @Override
    protected void onResume() {
        super.onResume();
        setTitle(getString(R.string.dashboard));


    }

    public void onBackPressed() {
        if (mDrawerFragment.isDrawerOpen()) {
            mDrawerFragment.closeDrawer();
        } else {
            Fragment fragment = fragmentManager.findFragmentByTag("caseList");
            if (fragment != null && fragment.isVisible()) {
                this.finish();
            } else
                super.onBackPressed();
        }
    }

    @Override
    public BaseFragmentDrawer getDrawerFragment() {
        return (TraquerFragmentDrawer) fragmentManager.findFragmentById(R.id.fragment_navigation_drawer_traquer);
    }


    @Override
    public int getView() {
        return R.layout.activity_stryker_home;
    }

    public void displayView(int position) {
        switch (position) {
            case 0: {
             /*   Intent intent = new Intent(this, UserMapActivity.class);
                startActivity(intent);*/
                break;
            }
            case 1: {
                Intent intent = new Intent(this, NotificationActivity.class);
                startActivity(intent);
                break;
            }
            case 2: {
                Intent intent = new Intent(this, HistoryActivity.class);
                startActivity(intent);
                break;
            }

          /*  case 3: {
                EventsLog.customEvent("MENU", "General settings", "CLICK");
                Intent intent = new Intent(this, SettingActivity.class);
                startActivityForResult(intent, REQUEST_SETTING);
                break;
            }
            case 4: {
                EventsLog.customEvent("MENU", "Tracking settings", "CLICK");
                Intent intent = new Intent(this, TrackingSettingActivity.class);
                startActivityForResult(intent, REQUEST_SETTING);
                break;
            }case 5: {
                EventsLog.customEvent("MENU", "Contact settings", "CLICK");
                Intent intent = new Intent(this, ContactSettingActivity.class);
                startActivityForResult(intent, REQUEST_SETTING);
                break;
            }*/

            case 3: {
                EventsLog.customEvent("MENU", "HELP", "CLICK");
                Intent intent = new Intent(this, HelpActivity.class);
                startActivity(intent);
                break;
            }
            case 4: {
                EventsLog.customEvent("MENU", "ABOUT", "CLICK");
                Intent intent = new Intent(this, AboutActivity.class);
                startActivity(intent);
                break;
            }
           /* case 8: {
                io.akwa.traquer.guardtrack.common.utils.Util.sendDiagnostic(this);
                break;
            }
            case 9: {
                DialogClass.alerDialog(this,PrefUtils.getLogStatus()?"Log Disabled":"Log Enabled");
                getDrawerFragment().switchLogStatus();
                NBLogger.getLoger().setLogStatus(PrefUtils.getLogStatus());
                break;
            }
*/
            case 5: {
                EventsLog.customEvent("MENU", "LOGOUT", "CLICK");
                onSignOutClicked();
                break;
            }
            /*case 11: {
                Intent intent = new Intent(this, NFCActivity.class);
                startActivityForResult(intent, 2);
                break;
            }*/

        }


    }



    @Override
    protected void updateTitle(Fragment f) {

    }

    @Override
    public Intent getLoginIntent() {
        return new Intent(this, LoginActivity.class);
    }



    @Override
    public void onDrawerItemSelected(View view, int position) {
        displayView(position);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case R.id.menu_search:
                /*Intent intent = new Intent(HomeActivity.this, SearchActivity.class);
                startActivity(intent);*/
                break;
            case R.id.menu_sort:
               // openfilterDialog();
                break;
        }

        return true;
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_home, menu);
        return true;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_SETTING && resultCode == RESULT_OK) {
            mDrawerFragment.setUserProfileInfo();
        }
        if (locationBluetoothPermissionUtility != null) {
            locationBluetoothPermissionUtility.onActivityResult(requestCode, resultCode, data);
        }

        Log.i("On Activity Reuslt Call","On Acitivity");


        super.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public void onPermissionGranted(boolean isGranted) {
        if (!isGranted) {


        } else {
            locationBluetoothPermissionUtility = new LocationBluetoothPermissionUtility(this);
            locationBluetoothPermissionUtility.checkLocationOnOff();
            locationBluetoothPermissionUtility.setLocationListener(new LocationBluetoothPermissionUtility.LocationBluetoothListener() {
                @Override
                public void onLocationON() {
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
                }

                @Override
                public void onLocationOFF() {
                    locationBluetoothPermissionUtility.checkBluetoothOnOff();
                }

                @Override
                public void onBluetoothON() {
                    showSessionOutDialog();

                }

                @Override
                public void onBluetoothOFF() {
                    showSessionOutDialog();
                }
            });
        }
    }

    public void showSessionOutDialog() {
        if (getIntent().getStringExtra(StringUtils.IntentKey.SESSION_MESSAGE) != null && !TextUtils.isEmpty(getIntent().getStringExtra(StringUtils.IntentKey.SESSION_MESSAGE))) {
            new Handler().postDelayed(new Runnable() {

                public void run() {
                    DialogClass.alerDialog(HomeActivity.this, getIntent().getStringExtra(StringUtils.IntentKey.SESSION_MESSAGE));
                }

            }, 2000);
        }
    }


    void onSignOutClicked() {
        DialogClass.showDialog(this, this.getString(R.string.please_wait));
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("appCode",PrefUtils.getCode());

        actionsListener.unLinkDevice(jsonObject);
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onUnLinkDevice(ApiResponseModel loginResponse, NicbitException e) {
        DialogClass.dismissDialog(this);

        PrefUtils.clearDataOnLogout();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        this.finish();

    }

    @Override
    public void onLinkDevice(ApiResponseModel loginResponse, NicbitException e) {
       Log.i("Device Link","Device Linked");
        if(loginResponse!=null)
        {
            if(loginResponse.getCode()==200) {
                PrefUtils.setLinkedDevice(true);
            }
        }



    }
    public void setSetting(ReaderGetSettingsResponse readerGetSettingsResponse) {
        PrefUtils.setDefaultView(readerGetSettingsResponse.getDashboardDefaultView());
        PrefUtils.setSortBy(readerGetSettingsResponse.getDashboardSortBy());
        PrefUtils.setSortOrder(readerGetSettingsResponse.getDashboardSortOrder());
        PrefUtils.setNotification(readerGetSettingsResponse.getNotifications());
        PrefUtils.setVibration(readerGetSettingsResponse.getVibration());
        PrefUtils.setSound(readerGetSettingsResponse.getSound());
        PrefUtils.setLed(readerGetSettingsResponse.getLed());
        PrefUtils.setBeaconStatus(readerGetSettingsResponse.getBeaconServiceStatus());

        //setting tracking setting
        GetTrackingSettingResponse trackingSettingResponse=new GetTrackingSettingResponse();
        trackingSettingResponse.setData(readerGetSettingsResponse.getTrackingHours());
        Gson gson=new Gson();
        String trackingSetting= gson.toJson(trackingSettingResponse);
        PrefUtils.setTrackingSettings(trackingSetting);

    }

    @Override
    public void onGetSettingsResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                ReaderGetSettingsResponse readerGetSettingsResponse = response.getData().getReaderGetSettingsResponse();
                // PrefUtils.setSettingFetched(true);
                if (readerGetSettingsResponse != null) {
                    setSetting(readerGetSettingsResponse);
                    if(!PrefUtils.getBeaconStatus())
                        Tracker.stopTracking();
                }

            }

        }
        else
        {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onUpdateSettingsResponseReceive(ApiResponseModel response, NicbitException e) {

    }

    void getSettings() {
        if(!PrefUtils.getSettingFetched())
            settingActionListener.getSettings();
    }

}
