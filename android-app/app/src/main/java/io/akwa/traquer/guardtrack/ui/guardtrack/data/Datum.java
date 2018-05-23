package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Datum implements Parcelable {

    @SerializedName("id")
    @Expose
    private String id;
    @SerializedName("code")
    @Expose
    private String code;
    @SerializedName("name")
    @Expose
    private String name;

    @SerializedName("tourStatus")
    @Expose
    private Integer tourStatus=null;


    @SerializedName("tourId")
    @Expose
    private Integer tourId=null;

    @SerializedName("status")
    @Expose
    private Integer status;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("from")
    @Expose
    private String from;
    @SerializedName("to")
    @Expose
    private String to;
    @SerializedName("images")
    @Expose
    private List<Object> images = null;
    @SerializedName("notes")
    @Expose
    private Object notes;
    @SerializedName("attendees")
    @Expose
    private List<Attendee> attendees = null;
    @SerializedName("locations")
    @Expose
    private List<Location> locations = null;
    @SerializedName("updatedOn")
    @Expose
    private String updatedOn;
    @SerializedName("updatedBy")
    @Expose
    private String updatedBy;
    @SerializedName("client")
    @Expose
    private Client client;
    @SerializedName("tags")
    @Expose
    private List<Object> tags = null;

    @SerializedName("task")
    @Expose
    Task task=null;

    public Integer getTourStatus() {
        return tourStatus;
    }

    public void setTourStatus(Integer tourStatus) {
        this.tourStatus = tourStatus;
    }

    @SerializedName("duration")
    @Expose
    private Long duration=null;

    public Long getDuration() {
        return duration;
    }

    public Task getTask() {
        return task;
    }

    public Integer getTourId() {
        return tourId;
    }

    public void setTourId(Integer tourId) {
        this.tourId = tourId;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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

    public List<Object> getImages() {
        return images;
    }

    public void setImages(List<Object> images) {
        this.images = images;
    }

    public Object getNotes() {
        return notes;
    }

    public void setNotes(Object notes) {
        this.notes = notes;
    }

    public List<Attendee> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<Attendee> attendees) {
        this.attendees = attendees;
    }

    public List<Location> getLocations() {
        return locations;
    }

    public void setLocations(List<Location> locations) {
        this.locations = locations;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<Object> getTags() {
        return tags;
    }

    public void setTags(List<Object> tags) {
        this.tags = tags;
    }





    protected Datum(Parcel in) {
        id = in.readString();
        code = in.readString();
        name = in.readString();
        tourStatus = in.readByte() == 0x00 ? null : in.readInt();
        tourId = in.readByte() == 0x00 ? null : in.readInt();
        status = in.readByte() == 0x00 ? null : in.readInt();
        description = in.readString();
        from = in.readString();
        to = in.readString();
        if (in.readByte() == 0x01) {
            images = new ArrayList<Object>();
            in.readList(images, Object.class.getClassLoader());
        } else {
            images = null;
        }
        notes = (Object) in.readValue(Object.class.getClassLoader());
        if (in.readByte() == 0x01) {
            attendees = new ArrayList<Attendee>();
            in.readList(attendees, Attendee.class.getClassLoader());
        } else {
            attendees = null;
        }
        if (in.readByte() == 0x01) {
            locations = new ArrayList<Location>();
            in.readList(locations, Location.class.getClassLoader());
        } else {
            locations = null;
        }
        updatedOn = in.readString();
        updatedBy = in.readString();
        client = (Client) in.readValue(Client.class.getClassLoader());
        if (in.readByte() == 0x01) {
            tags = new ArrayList<Object>();
            in.readList(tags, Object.class.getClassLoader());
        } else {
            tags = null;
        }
        task = (Task) in.readValue(Task.class.getClassLoader());
        duration = in.readByte() == 0x00 ? null : in.readLong();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(code);
        dest.writeString(name);
        if (tourStatus == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeInt(tourStatus);
        }
        if (tourId == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeInt(tourId);
        }
        if (status == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeInt(status);
        }
        dest.writeString(description);
        dest.writeString(from);
        dest.writeString(to);
        if (images == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(images);
        }
        dest.writeValue(notes);
        if (attendees == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(attendees);
        }
        if (locations == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(locations);
        }
        dest.writeString(updatedOn);
        dest.writeString(updatedBy);
        dest.writeValue(client);
        if (tags == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(tags);
        }
        dest.writeValue(task);
        if (duration == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeLong(duration);
        }
    }

    @SuppressWarnings("unused")
    public static final Parcelable.Creator<Datum> CREATOR = new Parcelable.Creator<Datum>() {
        @Override
        public Datum createFromParcel(Parcel in) {
            return new Datum(in);
        }

        @Override
        public Datum[] newArray(int size) {
            return new Datum[size];
        }
    };
}