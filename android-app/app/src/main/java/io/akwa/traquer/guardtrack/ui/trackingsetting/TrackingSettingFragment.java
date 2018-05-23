package io.akwa.traquer.guardtrack.ui.trackingsetting;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.Gson;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;
import io.akwa.traquer.guardtrack.ui.trackingsetting.model.TimePickerFragment;
import io.akwa.traquer.guardtrack.ui.trackingsetting.model.UpdateTrackingSetting;

import com.wdullaer.materialdatetimepicker.time.TimePickerDialog;


public class TrackingSettingFragment extends Fragment implements TrackingSettingContract.View, OnTimeChange, com.wdullaer.materialdatetimepicker.time.TimePickerDialog.OnTimeSetListener{


    public TrackingSettingContract.UserActionsListener mActionsListener;

    public static final String TAG = "ContactSettingFragment";

    @BindView(R.id.edtFromDate)
    EditText edtFromDate;
    @BindView(R.id.edtToDate)
    EditText edtToDate;

    @BindView(R.id.btn_submit)
    TextView btn_submit;


   boolean isFromDate;
    int tabPosition=0;
    EditText timeEditText;
    GetTrackingSettingResponse trackingSettingResponse;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.tracking_setting_fragment, container, false);
        ButterKnife.bind(this, view);
        mActionsListener = new TrackingSettingPresenter(this);
        return view;
    }


    @OnClick(R.id.edtToDate)
    public void onEdtToDateClick()
    {
         isFromDate=false;
        timeEditText=edtToDate;
       TimePickerFragment newFragment = new TimePickerFragment();
        newFragment.setTimeChangeListener(this);
        newFragment.show(getActivity().getSupportFragmentManager(), "TimePicker");

    }

    @OnClick(R.id.edtFromDate)
    public void onEdtFromDateClick()
    {
        isFromDate=true;
        timeEditText=edtFromDate;
        TimePickerFragment newFragment = new TimePickerFragment();
        newFragment.setTimeChangeListener(this);
        newFragment.show(getActivity().getSupportFragmentManager(), "TimePicker");
    }

    public void setTabPosition(int tabPosition)
    {
        this.tabPosition=tabPosition;
        if(trackingSettingResponse!=null)
        setData(trackingSettingResponse);
    }


    @OnClick(R.id.btn_submit)
    public void onClick()
    {
        saveData();
    }



    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getSettings();

    }

    public void saveData() {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        UpdateTrackingSetting request = getSettingData();
        mActionsListener.updateSettings(request);

    }

    void getSettings() {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        mActionsListener.getSettings();
    }


    public UpdateTrackingSetting getSettingData() {
        UpdateTrackingSetting updateSettingsRequest=new UpdateTrackingSetting();
        updateSettingsRequest.setSaturday(trackingSettingResponse.getData().getSaturday());
        updateSettingsRequest.setSunday(trackingSettingResponse.getData().getSunday());
        updateSettingsRequest.setWeekdays(trackingSettingResponse.getData().getWeekdays());
        return updateSettingsRequest;


    }


    @Override
    public void onGetSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() ==200||response.getCode()==201) {

                if (response != null) {
                    trackingSettingResponse=response;
                    setData(response);
                    setDataInPreferences(response);
                }
            } else if (response.getCode() == 209) {

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));        }
    }

    private void setData(GetTrackingSettingResponse readerGetSettingsResponse) {

             if(tabPosition==0)
             {
                 if(readerGetSettingsResponse.getData().getWeekdays()!=null)
                 {
                     GetTrackingSettingResponse.Weekday weekday=readerGetSettingsResponse.getData().getWeekdays().get(0);
                     edtFromDate.setText(getDisplayTime(weekday.getFrom()));
                     edtToDate.setText(getDisplayTime(weekday.getTo()));
                 }
             }
             else if(tabPosition==1)
             {
                 if(readerGetSettingsResponse.getData().getSaturday()!=null)
                 {
                     GetTrackingSettingResponse.Saturday saturday=readerGetSettingsResponse.getData().getSaturday().get(0);
                     edtFromDate.setText(getDisplayTime(saturday.getFrom()));
                     edtToDate.setText(getDisplayTime(saturday.getTo()));
                 }
             }
             else if(tabPosition==2)
             {
                 if(readerGetSettingsResponse.getData().getSunday()!=null)
                 {
                     GetTrackingSettingResponse.Sunday sunday=readerGetSettingsResponse.getData().getSunday().get(0);
                     edtFromDate.setText(getDisplayTime(sunday.getFrom()));
                     edtToDate.setText(getDisplayTime(sunday.getTo()));
                 }
             }

    }

    @Override
    public void onUpdateSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() == 200||response.getCode()==201) {
                DialogClass.alerDialog(getActivity(),response.getDescription());
                setDataInPreferences(response);
            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));        }

    }

    public void setDataInPreferences(GetTrackingSettingResponse response) {

        Gson gson=new Gson();
        String settings=gson.toJson(response);
        PrefUtils.setTrackingSettings(settings);
    }

    @Override
    public void onTimeChange(String hour, String mint) {
        String time;
        if(isFromDate) {
            time = hour + ":" + mint + ":00";
        }
        else {
            time = hour + ":" + mint + ":59";
        }
        if(trackingSettingResponse!=null) {
            if (tabPosition == 0) {
                if (isFromDate) {
                    if(TrackingSettingUtil.getDate(time).before(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getWeekdays().get(0).getTo()))) {
                        trackingSettingResponse.getData().getWeekdays().get(0).setFrom(time);
                        timeEditText.setText(getDisplayTime(time));
                    }
                    else
                       showMessage();
                }
                else {
                    if(TrackingSettingUtil.getDate(time).after(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getWeekdays().get(0).getFrom()))) {
                            trackingSettingResponse.getData().getWeekdays().get(0).setTo(time);
                            timeEditText.setText(getDisplayTime(time));
                        }
                        else
                        {
                            showMessage();
                        }
                }
            } else if (tabPosition == 1) {
                if (isFromDate) {
                    if(TrackingSettingUtil.getDate(time).before(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getSaturday().get(0).getTo()))) {
                        trackingSettingResponse.getData().getSaturday().get(0).setFrom(time);
                        timeEditText.setText(getDisplayTime(time));
                    }
                    else
                        showMessage();
                }
                else {
                    if(TrackingSettingUtil.getDate(time).after(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getSaturday().get(0).getFrom()))) {
                        trackingSettingResponse.getData().getSaturday().get(0).setTo(time);
                        timeEditText.setText(getDisplayTime(time));
                    }
                    else
                    {
                        showMessage();
                    }
                }
            } else if (tabPosition == 2) {
                if (isFromDate) {
                    if(TrackingSettingUtil.getDate(time).before(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getSunday().get(0).getTo()))) {
                        trackingSettingResponse.getData().getSunday().get(0).setFrom(time);
                        timeEditText.setText(getDisplayTime(time));
                    }
                    else
                        showMessage();
                }
                else {
                    if(TrackingSettingUtil.getDate(time).after(TrackingSettingUtil.getDate(trackingSettingResponse.getData().getSunday().get(0).getFrom()))) {
                        trackingSettingResponse.getData().getSunday().get(0).setTo(time);
                        timeEditText.setText(getDisplayTime(time));
                    }
                    else
                    {
                        showMessage();
                    }
                }
            }
        }



    }

    public String getDisplayTime(String time)
    {

        String displayTime=time.substring(0,time.lastIndexOf(":"));
        return displayTime;

    }

    public void showMessage()
    {
        if(isFromDate)
        DialogClass.alerDialog(getActivity(),"StartTime should be before EndTime");
        else
            DialogClass.alerDialog(getActivity(),"EndTime should be after StartTime");

    }


    @Override
    public void onTimeSet(TimePickerDialog view, int hourOfDay, int minute, int second) {

    }
}
