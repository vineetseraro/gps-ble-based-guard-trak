package io.akwa.traquer.guardtrack.common.utils;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;


import java.util.ArrayList;
import java.util.Locale;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.model.ReaderGetCountriesResponse;

public class CountryListAdapter extends ArrayAdapter<ReaderGetCountriesResponse> {

    private ArrayList<ReaderGetCountriesResponse> countryList;
    ArrayList<ReaderGetCountriesResponse> originalCountryList = new ArrayList<>();
    Context context;

    public CountryListAdapter(Context context, int textViewResourceId,
                              ArrayList<ReaderGetCountriesResponse> countryList) {
        super(context, textViewResourceId, countryList);
        this.countryList = new ArrayList<>();
        this.countryList.addAll(countryList);
        this.originalCountryList.addAll(countryList);
        this.context = context;
    }


    @Override
    public View getView(int position, View contentView, ViewGroup parent) {
        ViewHolder holder;
        if (contentView == null) {
            holder = new ViewHolder();
            LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            contentView = layoutInflater.inflate(R.layout.country_list_items, parent, false);
            holder.countryCode = (TextView) contentView.findViewById(R.id.countryCode);
            holder.countryName = (TextView) contentView.findViewById(R.id.countryName);

            contentView.setTag(holder);
        } else {
            holder = (ViewHolder) contentView.getTag();


        }
        if (position < getCount()) {
            ReaderGetCountriesResponse country = countryList.get(position);
            if (country != null) {
                holder.countryCode.setText(country.getShortCode());
                holder.countryName.setText(country.getCountryName());
            }

        }


        return contentView;
    }

    @Override
    public int getCount() {
        return countryList.size();
    }

    @Override
    public ReaderGetCountriesResponse getItem(int position) {
        return countryList.get(position);
    }

    static class ViewHolder {
        TextView countryCode, countryName;

    }

    public void filter(String charText) {
        charText = charText.toLowerCase(Locale.getDefault());
        ArrayList<ReaderGetCountriesResponse> filteredCountrylist = new ArrayList<>();
        filteredCountrylist.addAll(originalCountryList);

        countryList.clear();

        for (ReaderGetCountriesResponse wp : filteredCountrylist) {
            if (wp.getCountryName().toLowerCase(Locale.getDefault()).contains(charText)) {
                countryList.add(wp);
            }
        }
        notifyDataSetChanged();
    }


}