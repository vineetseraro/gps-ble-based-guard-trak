package io.akwa.traquer.guardtrack.ui.settings;

import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.RadioGroup;
import android.widget.Switch;


import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.tracking.Tracker;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.ReaderGetSettingsResponse;
import io.akwa.traquer.guardtrack.model.UpdateSettingsRequest;
import io.akwa.traquer.guardtrack.ui.enums.CaseSortBy;
import io.akwa.traquer.guardtrack.ui.enums.CaseSortOrder;
import io.akwa.traquer.guardtrack.ui.enums.DefaultView;

public class SettingFragment extends Fragment implements SettingContract.View {


    public SettingContract.UserActionsListener mActionsListener;
    @BindView(R.id.notificationSwitch)
    Switch notificationASwitch;
    @BindView(R.id.defaultViewRadioGroup)
    RadioGroup defaultViewRadioGroup;
    @BindView(R.id.sortByRadioGroup)
    RadioGroup sortByRadioGroup;
    @BindView(R.id.sortOrderRadioGroup)
    RadioGroup sortOrderRadioGroup;
    @BindView(R.id.beaconServiceSwitch)
    Switch beaconServiceSwitch;
    public static final String TAG = "ContactSettingFragment";


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_setting, container, false);
        ButterKnife.bind(this, view);
        mActionsListener = new SettingPresenter(this);
        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getSettings();

    }


    void onBeaconServiceSwitchChecked() {

        beaconServiceSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {

                saveData();
                if (isChecked) {
                    EventsLog.customEvent("SETTING", "BEACON_SERVICE", "YES");
                    startTracking();

                } else {
                    Tracker.stopTracking();
                    EventsLog.customEvent("SETTING", "BEACON_SERVICE", "NO");

                }
            }

        });
        notificationASwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {

                saveData();

            }

        });
        beaconServiceSwitch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveData();
            }
        });
        notificationASwitch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveData();
            }
        });
        for (int i = 0; i < defaultViewRadioGroup.getChildCount(); i++) {
            defaultViewRadioGroup.getChildAt(i).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    saveData();
                }
            });
        }
        for (int i = 0; i < sortOrderRadioGroup.getChildCount(); i++) {
            sortOrderRadioGroup.getChildAt(i).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    saveData();
                }
            });
        }
        for (int i = 0; i < sortByRadioGroup.getChildCount(); i++) {
            sortByRadioGroup.getChildAt(i).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    saveData();
                }
            });
        }


    }


    public void saveData() {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        UpdateSettingsRequest request = getDataFromView();
        EventsLog.settingEvent(request);
        mActionsListener.updateSettings(request);

    }

    void getSettings() {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        mActionsListener.getSettings();
    }


    public UpdateSettingsRequest getDataFromView() {
        int radioButtonID, position;
        View radioButton;
        UpdateSettingsRequest request = new UpdateSettingsRequest();

        radioButtonID = defaultViewRadioGroup.getCheckedRadioButtonId();
        if (radioButtonID != -1) {
            radioButton = defaultViewRadioGroup.findViewById(radioButtonID);
            position = defaultViewRadioGroup.indexOfChild(radioButton);
            request.setDashboardDefaultView(DefaultView.getNameByPosition(position));
        }


        radioButtonID = sortByRadioGroup.getCheckedRadioButtonId();
        if (radioButtonID != -1) {
            radioButton = sortByRadioGroup.findViewById(radioButtonID);
            position = sortByRadioGroup.indexOfChild(radioButton);
            request.setDashboardSortBy(CaseSortBy.getNameByPosition(position));
        }

        radioButtonID = sortOrderRadioGroup.getCheckedRadioButtonId();
        if (radioButtonID != -1) {
            radioButton = sortOrderRadioGroup.findViewById(radioButtonID);
            position = sortOrderRadioGroup.indexOfChild(radioButton);
            request.setDashboardSortOrder(CaseSortOrder.getNameByPosition(position));
        }

        request.setBeaconServiceStatus(beaconServiceSwitch.isChecked());


        request.setNotifications(notificationASwitch.isChecked());
        request.setSilentHrsFrom("");
        request.setSilentHrsTo("");
        return request;
    }


    @Override
    public void onGetSettingsResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                ReaderGetSettingsResponse readerGetSettingsResponse = response.getData().getReaderGetSettingsResponse();
                if (readerGetSettingsResponse != null) {
                    setData(readerGetSettingsResponse);
                    setDataInPreferences();
                }
            } else if (response.getCode() == 209) {
                onBeaconServiceSwitchChecked();


            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
                onBeaconServiceSwitchChecked();

            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));

            onBeaconServiceSwitchChecked();

        }
    }

    private void setData(ReaderGetSettingsResponse readerGetSettingsResponse) {


        notificationASwitch.setChecked(readerGetSettingsResponse.getNotifications());
        String defaultView = readerGetSettingsResponse.getDashboardDefaultView();

        if (defaultView.equalsIgnoreCase(DefaultView.ALL.getName())) {
            int id = defaultViewRadioGroup.getChildAt(DefaultView.ALL.getPosition() * 2).getId();
            defaultViewRadioGroup.check(id);
        } else if (defaultView.equalsIgnoreCase(DefaultView.WATCHED.getName())) {
            int id = defaultViewRadioGroup.getChildAt(DefaultView.WATCHED.getPosition() * 2).getId();
            defaultViewRadioGroup.check(id);
        } else if (defaultView.equalsIgnoreCase(DefaultView.EXCEPTIONS.getName())) {
            int id = defaultViewRadioGroup.getChildAt(DefaultView.EXCEPTIONS.getPosition() * 2).getId();
            defaultViewRadioGroup.check(id);
        }


        String sortBy = readerGetSettingsResponse.getDashboardSortBy();
        if (sortBy.equalsIgnoreCase(CaseSortBy.ETD.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.ETD.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.CASENO.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.CASENO.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.HOSPITAL.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.HOSPITAL.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.DOCTOR.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.DOCTOR.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.SURGERYTYPE.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.SURGERYTYPE.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.SURGERYDATE.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.SURGERYDATE.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        } else if (sortBy.equalsIgnoreCase(CaseSortBy.LAST_STATUS_CHANGED.getName())) {
            int id = sortByRadioGroup.getChildAt(CaseSortBy.LAST_STATUS_CHANGED.getPosition() * 2).getId();
            sortByRadioGroup.check(id);
        }


        String sortedOrder = readerGetSettingsResponse.getDashboardSortOrder();
        if (sortedOrder.equalsIgnoreCase(CaseSortOrder.ASC.getName())) {
            int id = sortOrderRadioGroup.getChildAt(CaseSortOrder.ASC.getPosition() * 2).getId();
            sortOrderRadioGroup.check(id);
        } else if (sortedOrder.equalsIgnoreCase(CaseSortOrder.DESC.getName())) {
            int id = sortOrderRadioGroup.getChildAt(CaseSortOrder.DESC.getPosition() * 2).getId();
            sortOrderRadioGroup.check(id);
        }

        boolean beaconStatus = readerGetSettingsResponse.getBeaconServiceStatus();
        beaconServiceSwitch.setChecked(beaconStatus);
        if (beaconStatus) {
            startTracking();
        } else {
            Tracker.stopTracking();
        }
        onBeaconServiceSwitchChecked();


    }

    @Override
    public void onUpdateSettingsResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                setDataInPreferences();
            } else if (response.getCode() == 209) {

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }

    }

    public void setDataInPreferences() {
        UpdateSettingsRequest settings = getDataFromView();
        PrefUtils.setDefaultView(settings.getDashboardDefaultView());
        PrefUtils.setSortBy(settings.getDashboardSortBy());
        PrefUtils.setSortOrder(settings.getDashboardSortOrder());
        PrefUtils.setNotification(settings.getNotifications());
        PrefUtils.setBeaconStatus(settings.getBeaconServiceStatus());
    }

    public boolean checkSettingsChanged() {
        UpdateSettingsRequest settings = getDataFromView();
        return !(PrefUtils.getDefaultView().equals(settings.getDashboardDefaultView()) &&
                PrefUtils.getSortBy().equals(settings.getDashboardSortBy()) &&
                PrefUtils.getSortOrder().equals(settings.getDashboardSortOrder()) &&
                PrefUtils.getNotification() == settings.getNotifications() &&
                PrefUtils.getBeaconStatus() == settings.getBeaconServiceStatus());

    }

    public void startTracking() {
        if (!PrefUtils.getCode().equals("")) {
            if (Build.VERSION.SDK_INT >= 23) {
                if (ContextCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    PrefUtils.setBeaconStatus(true);
                    Tracker.startTracking();
                }
            } else {
                Tracker.startTracking();
            }
        }
    }


}
