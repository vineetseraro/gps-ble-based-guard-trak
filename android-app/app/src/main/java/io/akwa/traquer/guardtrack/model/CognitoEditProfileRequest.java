package io.akwa.traquer.guardtrack.model;

/**
 * Created by rohitkumar on 10/3/17.
 */

public class CognitoEditProfileRequest {


    String CountryCode="";
    String MobileNumber="";
    String email="";
    String  given_name="";
    String family_name="";
    String picture="";
    int   deleteProfileImage;
    String MobileCode="";

    public String getMobileCode() {
        return MobileCode;
    }

    public void setMobileCode(String mobileCode) {
        MobileCode = mobileCode;
    }

    public int getDeleteProfileImage() {
        return deleteProfileImage;
    }

    public void setDeleteProfileImage(int deleteProfileImage) {
        this.deleteProfileImage = deleteProfileImage;
    }

    public String getCountryCode() {
        return CountryCode;
    }

    public void setCountryCode(String countryCode) {
        CountryCode = countryCode;
    }

    public String getMobileNumber() {
        return MobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        MobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGiven_name() {
        return given_name;
    }

    public void setGiven_name(String given_name) {
        this.given_name = given_name;
    }

    public String getFamily_name() {
        return family_name;
    }

    public void setFamily_name(String family_name) {
        this.family_name = family_name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
