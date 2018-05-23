package io.akwa.traquer.guardtrack.common;

import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.answers.ContentViewEvent;
import com.crashlytics.android.answers.CustomEvent;
import com.crashlytics.android.answers.LoginEvent;

import java.io.File;

import io.akwa.traquer.guardtrack.model.UpdateSettingsRequest;

public class EventsLog {

    public static void login(boolean success, String email, Integer code) {
        Answers.getInstance().logLogin(new LoginEvent()
                .putCustomAttribute("email", email)
                .putCustomAttribute("code", code)
                .putSuccess(success));
    }

    public static void view(String activityName) {
        Answers.getInstance().logContentView(new ContentViewEvent()
                .putContentName(activityName));
    }

    public static void editProfile(boolean success, String password, File file) {
        Answers.getInstance().logCustom(new CustomEvent("EDIT PROFILE")
                .putCustomAttribute("Password Change",password.isEmpty()?"NO":"YES")
                .putCustomAttribute("Image Upload",file==null?"YES":"NO")
                .putCustomAttribute("Success",success?"YES":"NO")
        );
    }

    public static void customEvent(String eventName,String key,String value) {
        Answers.getInstance().logCustom(new CustomEvent(eventName)
                .putCustomAttribute(key,value)
        );
    }

    public static void settingEvent(UpdateSettingsRequest request) {
        EventsLog.customEvent("SETTING", "DEFAULT_VIEW",request.getDashboardDefaultView());
        EventsLog.customEvent("SETTING", "SORT_ORDER",request.getDashboardSortOrder());
        EventsLog.customEvent("SETTING", "SORT_BY",request.getDashboardSortBy());
        EventsLog.customEvent("SETTING", "NOTIFICATION",Boolean.toString(request.getNotifications()));

    }
}
