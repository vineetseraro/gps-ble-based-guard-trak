package io.akwa.tracker.geofence;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by rohitkumar on 11/20/17.
 */

public class AkLocation implements Parcelable {
    double lat;
    double lng;
    String locationTitle;

    public AkLocation(double lat, double lng, String locationTitle) {
        this.lat = lat;
        this.lng = lng;
        this.locationTitle = locationTitle;
    }
    public AkLocation(){

    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public String getLocationTitle() {
        return locationTitle;
    }

    public void setLocationTitle(String locationTitle) {
        this.locationTitle = locationTitle;
    }

    protected AkLocation(Parcel in) {
        lat = in.readDouble();
        lng = in.readDouble();
        locationTitle = in.readString();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeDouble(lat);
        dest.writeDouble(lng);
        dest.writeString(locationTitle);
    }

    @SuppressWarnings("unused")
    public static final Parcelable.Creator<AkLocation> CREATOR = new Parcelable.Creator<AkLocation>() {
        @Override
        public AkLocation createFromParcel(Parcel in) {
            return new AkLocation(in);
        }

        @Override
        public AkLocation[] newArray(int size) {
            return new AkLocation[size];
        }
    };
}
