package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Location implements Parcelable {

    @SerializedName("pointCoordinates")
    @Expose
    private PointCoordinates pointCoordinates;
    @SerializedName("name")
    @Expose
    private String name;
    @SerializedName("code")
    @Expose
    private String code;
    @SerializedName("id")
    @Expose
    private String id;
    @SerializedName("floor")
    @Expose
    private Floor floor;
    @SerializedName("address")
    @Expose
    private List<Address> address = null;

    public PointCoordinates getPointCoordinates() {
        return pointCoordinates;
    }

    public void setPointCoordinates(PointCoordinates pointCoordinates) {
        this.pointCoordinates = pointCoordinates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }


    protected Location(Parcel in) {
        pointCoordinates = (PointCoordinates) in.readValue(PointCoordinates.class.getClassLoader());
        name = in.readString();
        code = in.readString();
        id = in.readString();
        floor = (Floor) in.readValue(Floor.class.getClassLoader());
        if (in.readByte() == 0x01) {
            address = new ArrayList<Address>();
            in.readList(address, Address.class.getClassLoader());
        } else {
            address = null;
        }
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeValue(pointCoordinates);
        dest.writeString(name);
        dest.writeString(code);
        dest.writeString(id);
        dest.writeValue(floor);
        if (address == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(address);
        }
    }

    @SuppressWarnings("unused")
    public static final Parcelable.Creator<Location> CREATOR = new Parcelable.Creator<Location>() {
        @Override
        public Location createFromParcel(Parcel in) {
            return new Location(in);
        }

        @Override
        public Location[] newArray(int size) {
            return new Location[size];
        }
    };
}