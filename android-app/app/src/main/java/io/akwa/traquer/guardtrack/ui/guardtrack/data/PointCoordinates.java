package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class PointCoordinates implements Parcelable {

    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("coordinates")
    @Expose
    private List<Double> coordinates = null;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Double> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Double> coordinates) {
        this.coordinates = coordinates;
    }


    protected PointCoordinates(Parcel in) {
        type = in.readString();
        if (in.readByte() == 0x01) {
            coordinates = new ArrayList<Double>();
            in.readList(coordinates, Double.class.getClassLoader());
        } else {
            coordinates = null;
        }
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(type);
        if (coordinates == null) {
            dest.writeByte((byte) (0x00));
        } else {
            dest.writeByte((byte) (0x01));
            dest.writeList(coordinates);
        }
    }

    @SuppressWarnings("unused")
    public static final Parcelable.Creator<PointCoordinates> CREATOR = new Parcelable.Creator<PointCoordinates>() {
        @Override
        public PointCoordinates createFromParcel(Parcel in) {
            return new PointCoordinates(in);
        }

        @Override
        public PointCoordinates[] newArray(int size) {
            return new PointCoordinates[size];
        }
    };
}