package io.akwa.traquer.guardtrack.ui.contactsettings.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

import io.akwa.traquer.guardtrack.model.BaseResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public class GetContactSettingsResponse extends BaseResponse{

    @SerializedName("data")
    @Expose
    private List<Contact> data = null;

    public List<Contact> getData() {
        return data;
    }

    public void setData(List<Contact> data) {
        this.data = data;
    }

    public class Contact
    {

        @SerializedName("number")
        @Expose
        private String number;
        @SerializedName("name")
        @Expose
        private String name;

        public String getNumber() {
            return number;
        }

        public void setNumber(String number) {
            this.number = number;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
