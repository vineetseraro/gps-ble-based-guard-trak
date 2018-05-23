package io.akwa.traquer.guardtrack.ui.home;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.widget.DatePicker;


import java.util.Calendar;
import java.util.Date;

import io.akwa.traquer.guardtrack.ui.home.model.DatePickerInterface;

public class DatePickerFragment extends DialogFragment
        implements DatePickerDialog.OnDateSetListener {
    DatePickerInterface datePickerInterface;
    private Date currentDate;

    public void setListener(DatePickerInterface datePickerInterface, Date currentDate) {
        this.datePickerInterface = datePickerInterface;
        this.currentDate = currentDate;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the current date as the default date in the picker
        Calendar c = Calendar.getInstance();
        c.setTime(currentDate);
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);
        return new DatePickerDialog(getActivity(), this, year, month, day);
    }

    public void onDateSet(DatePicker view, int year, int month, int day) {
        Calendar c = Calendar.getInstance();
        c.set(year, month, day);
        if (datePickerInterface != null)
            datePickerInterface.onDateUpdate(c.getTime());
    }
}
