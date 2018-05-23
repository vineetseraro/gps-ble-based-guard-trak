package io.akwa.traquer.guardtrack.ui.home;

import android.content.Intent;


import java.util.ArrayList;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.NavDrawerItem;
import io.akwa.traquer.guardtrack.ui.editProfile.EditProfileActivity;

public class TraquerFragmentDrawer extends BaseFragmentDrawer {
    @Override
    public ArrayList<NavDrawerItem> setDrawerItems() {

        ArrayList<NavDrawerItem> items = new ArrayList<>();
        items.add(new NavDrawerItem("Dashboard"
                , R.drawable.map_marker_icon));
        items.add(new NavDrawerItem("Notifications"
                , R.drawable.menu_notifications_off));
        items.add(new NavDrawerItem("History"
                , R.drawable.menu_casehistory));
      /*  items.add(new NavDrawerItem(getString(R.string.general_settings)
                , R.drawable.menu_settings_off));
        items.add(new NavDrawerItem(getString(R.string.tracking_settings)
                , R.drawable.menu_settings_off));
        items.add(new NavDrawerItem(getString(R.string.contact_settings)
                , R.drawable.menu_settings_off));*/
        items.add(new NavDrawerItem("FAQ"
                , R.drawable.menu_help_off));
        items.add(new NavDrawerItem("About"
                , R.drawable.menu_about_off));
       /* items.add(new NavDrawerItem(getString(R.string.send_diagnostic_text)
                , R.drawable.send_diagnostic_icon));
        if(PrefUtils.getLogStatus()) {
            items.add(new NavDrawerItem("Disable Log"
                    , R.drawable.send_diagnostic_icon));
        }
        else
        {
            items.add(new NavDrawerItem("Enable Log"
                    , R.drawable.send_diagnostic_icon));
        }*/
        items.add(new NavDrawerItem("Logout"
                , R.drawable.menu_logout_off));

        /*items.add(new NavDrawerItem("NFC Scan"
                , R.drawable.menu_logout_off));
*/
        return items;
    }

    @Override
    protected Intent getUpdateProfileIntent() {
        return new Intent(activity, EditProfileActivity.class);

    }
}
