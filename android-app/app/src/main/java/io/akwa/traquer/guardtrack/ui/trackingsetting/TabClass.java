package io.akwa.traquer.guardtrack.ui.trackingsetting;

import android.app.Activity;
import android.support.design.widget.TabLayout;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import io.akwa.traquer.guardtrack.R;


public class TabClass {

    public Activity activity;

    public TabClass(Activity activity) {
        this.activity = activity;
    }


    int[] tabIconsUnselected = {
            R.drawable.icon_all_off,
            R.drawable.icon_fav_off,
            R.drawable.icon_alert_off
    };

    String[] tabValues = {
            "WeekDays", "Saturday", "Sunday"
    };

    int[] tabIconsSelected = {
            R.drawable.icon_all_on,
            R.drawable.icon_fav_on,
            R.drawable.icon_alert_on
    };


    public String getTabValue(int id) {
        return tabValues[id];

    }

    public int getTabIconsUnselected(int id) {
        return tabIconsUnselected[id];
    }

    public int getTabIconsSelected(int id) {
        return tabIconsSelected[id];
    }


    public View getTabView(int id) {
        View view = LayoutInflater.from(activity).inflate(R.layout.custom_tab, null);
        TextView newTab = (TextView) view.findViewById(R.id.text);
        ImageView icon = (ImageView) view.findViewById(R.id.icon);
        newTab.setText(getTabValue(id));
        newTab.setTextColor(ContextCompat.getColor(activity,R.color.traquer_white_fifty_opacity));
        icon.setImageResource(getTabIconsUnselected(id));
        return view;
    }

    public void getUnSelectedTabView(int id, TabLayout.Tab tab) {
        TextView newTab = (TextView) tab.getCustomView().findViewById(R.id.text);
        ImageView icon = (ImageView) tab.getCustomView().findViewById(R.id.icon);
        newTab.setTextColor(ContextCompat.getColor(activity,R.color.traquer_white_fifty_opacity));
        icon.setImageResource(getTabIconsUnselected(id));
    }

    public void getSelectedTabView(int id, TabLayout.Tab tab) {
        TextView newTab = (TextView) tab.getCustomView().findViewById(R.id.text);
        newTab.setTextColor(ContextCompat.getColor(activity,R.color.traquer_white));
        ImageView icon = (ImageView) tab.getCustomView().findViewById(R.id.icon);
        icon.setImageResource(getTabIconsSelected(id));
    }
}
