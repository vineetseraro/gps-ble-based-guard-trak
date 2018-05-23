package io.akwa.traquer.guardtrack.ui.trackingsetting.model;

import android.app.Dialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.widget.TimePicker;

import java.util.Calendar;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.ui.trackingsetting.OnTimeChange;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class TimePickerFragment extends DialogFragment
        implements TimePickerDialog.OnTimeSetListener {
    OnTimeChange onTimeChange;

    public TimePickerFragment()

    {

    }
    public void setTimeChangeListener(OnTimeChange onTimeChange)
    {
        this.onTimeChange=onTimeChange;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        final Calendar c = Calendar.getInstance();
        int hour = c.get(Calendar.HOUR_OF_DAY);
        int minute = c.get(Calendar.MINUTE);
        TimePickerDialog timePickerDialog=new TimePickerDialog(getActivity(), R.style.DialogTheme, this, hour, minute,
                false);

        return timePickerDialog;
    }

    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {



        boolean is24HoursView=view.is24HourView();
        String hours=""+hourOfDay;
        String mint=""+minute;
        if(hourOfDay<10)
            hours="0"+hourOfDay;
        if(minute<10)
            mint="0"+minute;

        onTimeChange.onTimeChange(hours,mint);
    }
}