package io.akwa.traquer.guardtrack.common.utils;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;


import java.util.ArrayList;
import java.util.Locale;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.model.ReaderGetCountriesResponse;
import io.akwa.traquer.guardtrack.ui.editProfile.DefaultEditProfileActivity;

public class CountryCustomDialog extends Dialog {
    private  String title;
    private ListView countryListView;
    Activity context;
    ArrayList<ReaderGetCountriesResponse> countryList;
    EditText titleCountry;
    CountryListAdapter countryListAdapter;
    private DefaultEditProfileActivity.ClickListener clickListener;

    public CountryCustomDialog(Activity context, ArrayList<ReaderGetCountriesResponse> countryList, DefaultEditProfileActivity.ClickListener clickListener, String title) {
        super(context);
        this.context = context;
        this.countryList = countryList;
        this.clickListener = clickListener;
        this.title=title;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.dialog_country);
        init();
    }

    public void init() {
        titleCountry = (EditText) findViewById(R.id.title_country);
        titleCountry.setHint(title);
        countryListView = (ListView) findViewById(R.id.lv_country_list);
        countryListView.setTextFilterEnabled(true);
        countryListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ReaderGetCountriesResponse item = (ReaderGetCountriesResponse) parent.getAdapter().getItem(position);

                titleCountry.setText(item.getCountryName());
                titleCountry.setTag(item.getShortCode());
                clickListener.onClick(item);
                dismiss();

            }
        });
        countryListAdapter = new CountryListAdapter(context, R.layout.country_list_items, countryList);
        countryListView.
                setAdapter(countryListAdapter);

        titleCountry.addTextChangedListener(new TextWatcher() {

            @Override
            public void onTextChanged(CharSequence cs, int arg1, int arg2, int arg3) {

            }

            @Override
            public void beforeTextChanged(CharSequence arg0, int arg1, int arg2,
                                          int arg3) {

            }


            @Override
            public void afterTextChanged(Editable arg0) {
                String text = titleCountry.getText().toString().toLowerCase(Locale.getDefault());
                countryListAdapter.filter(text);
            }
        });

    }
}