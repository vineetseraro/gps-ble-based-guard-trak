package io.akwa.traquer.guardtrack.model;

public class ReaderGetCountriesResponse {
    private String shortCode;
    private String name;
    private String dialCode;



    public ReaderGetCountriesResponse(String countryName, String shortCode) {
        this.name=countryName;
        this.shortCode=shortCode;
    }


    public String getDialCode() {
        return dialCode;
    }

    public void setDialCode(String dialCode) {
        this.dialCode = dialCode;
    }

    /**
     *
     * @return
     * The shortCode
     */
    public String getShortCode() {
        return shortCode;
    }

    /**
     *
     * @param shortCode
     * The shortCode
     */
    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    /**
     *
     * @return
     * The countryName
     */
    public String getCountryName() {
        return name;
    }

    /**
     *
     * @param countryName
     * The countryName
     */
    public void setCountryName(String countryName) {
        this.name = countryName;
    }
}
