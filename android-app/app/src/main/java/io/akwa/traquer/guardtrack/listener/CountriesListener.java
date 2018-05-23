package io.akwa.traquer.guardtrack.listener;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.CountryApiResponse;

public interface CountriesListener {
    void onCountriesResponse(CountryApiResponse response, NicbitException e);
}
