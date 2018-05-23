package io.akwa.trakit.rulehandler;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


/**
 * Created by rohitkumar on 10/31/17.
 */

public class GetTrackingSettingResponse {

    @SerializedName("code")
    @Expose
    private Integer code;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("description")
    @Expose
    private String description;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    @SerializedName("data")
    @Expose

    TrackingHours data;


    public TrackingHours getData() {
        return data;
    }

    public void setData(TrackingHours data) {
        this.data = data;
    }

    public class Settings{
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


    public class Saturday {

        @SerializedName("from")
        @Expose
        private String from;
        @SerializedName("to")
        @Expose
        private String to;

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

    }

    public class Sunday {

        @SerializedName("from")
        @Expose
        private String from;
        @SerializedName("to")
        @Expose
        private String to;

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

    }

    public class Weekday {

        @SerializedName("from")
        @Expose
        private String from;
        @SerializedName("to")
        @Expose
        private String to;

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

    }

    public class TrackingHours {

        @SerializedName("weekdays")
        @Expose
        private List<Weekday> weekdays = null;
        @SerializedName("saturday")
        @Expose
        private List<Saturday> saturday = null;
        @SerializedName("sunday")
        @Expose
        private List<Sunday> sunday = null;

        public List<Weekday> getWeekdays() {
            return weekdays;
        }

        public void setWeekdays(List<Weekday> weekdays) {
            this.weekdays = weekdays;
        }

        public List<Saturday> getSaturday() {
            return saturday;
        }

        public void setSaturday(List<Saturday> saturday) {
            this.saturday = saturday;
        }

        public List<Sunday> getSunday() {
            return sunday;
        }

        public void setSunday(List<Sunday> sunday) {
            this.sunday = sunday;
        }

    }

}
