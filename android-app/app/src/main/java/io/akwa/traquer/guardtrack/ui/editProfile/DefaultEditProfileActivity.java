package io.akwa.traquer.guardtrack.ui.editProfile;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.joooonho.SelectableRoundedImageView;

import com.squareup.picasso.Picasso;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.utils.CountryCustomDialog;
import io.akwa.traquer.guardtrack.common.utils.CropImageUtil;
import io.akwa.traquer.guardtrack.common.utils.PhotoUtility;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.ReaderGetCountriesResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetProfileResponse;

public class DefaultEditProfileActivity extends BaseEditProfileActivity implements PhotoUtility.OnImageSelectListener {

    @BindView(R.id.edtEmail)
    EditText mEmail;
    @BindView(R.id.edtFirstName)
    EditText medtFirstName;
    @BindView(R.id.edtLastName)
    EditText medtLastName;
    @BindView(R.id.edtNewPassword)
    EditText medtNewPassword;
    @BindView(R.id.edtConfirmPassword)
    EditText medtConfirmPassword;
    @BindView(R.id.edtPhoneNo)
    EditText medtPhoneNo;
    @BindView(R.id.btn_submit)
    TextView mbtnSubmit;
    @BindView(R.id.btn_country_code)
    EditText mbtnCountryCode;
    @BindView(R.id.toolbar)
    Toolbar mToolbar;
    @BindView(R.id.toolbar_title)
    TextView mTitle;
    @BindView(R.id.userImage)
    SelectableRoundedImageView mUserImage;
    @BindView(R.id.userName)
    TextView mUserName;

    File file = null;
    ArrayList<ReaderGetCountriesResponse> countryTypes = new ArrayList<>();
    String countryTag = "", imgString = "";
    private CropImageUtil mPhotoUtils;
    private Integer isImageRemove = 0;
    boolean showCountriesList;
    String dialCode="";



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile_new);
        ButterKnife.bind(this);
        setupActionBar();
        setDefaultValue();
        getProfile();
        showCountriesList=false;
        getCountriesList(false);

    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText(getString(R.string.update_profile));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == android.R.id.home) {
            onBackPressed();
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if (mPhotoUtils != null) {
            mPhotoUtils.deleteImage();
        }
        setResult(Activity.RESULT_OK);
        finish();
    }

    public void setDefaultValue() {
        medtFirstName.setText(PrefUtils.getFirstName());
        medtLastName.setText(PrefUtils.getLastName());
        mUserName.setText(PrefUtils.getFirstName()+" "+PrefUtils.getLastName());
        medtPhoneNo.setText(PrefUtils.getMobile());
        mbtnCountryCode.setText(PrefUtils.getCountryCode());
        mbtnCountryCode.setTag(PrefUtils.getCountry());
        mEmail.setText(PrefUtils.getEmail());
        if (!TextUtils.isEmpty(PrefUtils.getUserImageUrl())) {
            Picasso.with(this).load(PrefUtils.getUserImageUrl()).error(R.drawable.default_profile_pic_yellow).into(mUserImage);
        } else {
            mUserImage.setImageResource(R.drawable.default_profile_pic_yellow);
        }

    }

    @Override
    protected void setValuesInPreference(String profileImageUrl) {
        PrefUtils.setFirstName(medtFirstName.getText().toString());
        PrefUtils.setLastName(medtLastName.getText().toString());
        PrefUtils.setMobile(medtPhoneNo.getText().toString());
        PrefUtils.setCountryCode(mbtnCountryCode.getText().toString());
        PrefUtils.setCountry(mbtnCountryCode.getTag().toString());
        PrefUtils.setUserImageUrl(profileImageUrl);
        if (mPhotoUtils != null) {
            mPhotoUtils.deleteImage();
        }

        EventsLog.editProfile(true,medtNewPassword.getText().toString(),file);

    }

    @Override
    public void setCountries(List<ReaderGetCountriesResponse> readerGetCountriesResponse) {
        if(countryTypes.size()==0)
            countryTypes.addAll(readerGetCountriesResponse);

       if(showCountriesList) {
           if (countryTypes.size() == 0) {
               Toast.makeText(this, "TrackingHours not fetched", Toast.LENGTH_LONG).show();
           } else {

               CountryCustomDialog countryCustomDialog = new CountryCustomDialog(this, countryTypes, new ClickListener() {
                   @Override
                   public void onClick(ReaderGetCountriesResponse country) {
                       dialCode=country.getDialCode();
                       mbtnCountryCode.setText(country.getShortCode() + "(+" + country.getDialCode() + ")");
                       mbtnCountryCode.setTag(country.getShortCode());
                   }
               }, "Select a Country");
               countryCustomDialog.setCanceledOnTouchOutside(false);
               countryCustomDialog.show();

           }
       }
       else
       {
           if(countryTypes.size()>0)
           {
               for(ReaderGetCountriesResponse response:countryTypes)
               {
                   if(PrefUtils.getCountry().equals(response.getShortCode()))
                   {
                       dialCode=response.getDialCode();
                       break;
                   }
               }
               PrefUtils.setCountryCode(PrefUtils.getCountry()+"(+"+dialCode+")");
               setDefaultValue();
           }
           //set country tag
       }
    }

    @Override
    protected void setProfile(ReaderGetProfileResponse profileResponse) {
       saveUserProfile(profileResponse);
        setDefaultValue();
    }

    @OnClick(R.id.btn_country_code)
    public void getCountries() {
        showCountriesList=true;
        if(countryTypes.size()==0)
         getCountriesList(true);
        else
            setCountries(countryTypes);
    }

    @OnClick(R.id.userImage)
    public void editImage() {
        mPhotoUtils = new CropImageUtil(this, this);
        mPhotoUtils.selectImage(new CropImageUtil.OnRemoveImageSelectListener() {
            @Override
            public void onRemoveImageSelected(boolean isRemove) {
                isImageRemove=1;
                mUserImage.setImageResource(R.drawable.default_profile_pic_yellow);
            }
        });
    }

    @OnClick(R.id.btn_submit)
    public void onSubmit() {

        if (medtFirstName.getText().toString().isEmpty()) {
            Toast.makeText(this, "Please enter first name.", Toast.LENGTH_SHORT).show();
        } else if (medtLastName.getText().toString().isEmpty()) {
            Toast.makeText(this, "Please enter last name.", Toast.LENGTH_SHORT).show();
        }

        else if (checkNewAndConfirmPassword()) {
            if (validateCountryCodeAndPhoneNumber()) {
                if (mbtnCountryCode.getTag() != null)
                    countryTag = mbtnCountryCode.getTag().toString();
                editProfile(isImageRemove, "", medtNewPassword.getText().toString(), medtFirstName.getText().toString(), medtLastName.getText().toString(), medtPhoneNo.getText().toString(), countryTag, file);
                View view = this.getCurrentFocus();
                if (view != null) {
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
                }
            }

        } else {
            Toast.makeText(this, getString(R.string.password_didnt_match), Toast.LENGTH_SHORT).show();
        }
    }

    boolean checkNewAndConfirmPassword() {
        String newPassword = medtNewPassword.getText().toString();
        String confirmPassword = medtConfirmPassword.getText().toString();

        return newPassword.equals(confirmPassword);
    }

    @Override
    public void onImageSelect(File file) {
        this.file = file;
        Bitmap myBitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
        mUserImage.setImageBitmap(myBitmap);
    }


    public interface ClickListener {
        void onClick(ReaderGetCountriesResponse country);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (mPhotoUtils != null)
            mPhotoUtils.onActivityResult(requestCode, resultCode, data);
    }
//
//    @Override
//    public void gotoLoginActivity() {
//
//    }




    private boolean validateCountryCodeAndPhoneNumber() {
        boolean isValid = false;
        String countryCode = mbtnCountryCode.getTag().toString();
        String phoneNumber = medtPhoneNo.getText().toString().trim();

        if (countryCode != null && countryCode.length() > 0 && phoneNumber.length() > 0) {
            if (isValidPhoneNumber(phoneNumber)) {
                isValid = validateUsingLibPhoneNumber(countryCode, phoneNumber);
                if (isValid) {
//            String internationalFormat = phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);
//            Toast.makeText(this, "Phone Number is Valid " + internationalFormat, Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(this, "Phone number did not match country code", Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(this, "Invalid phone number", Toast.LENGTH_SHORT).show();
            }
        } else {
            isValid = true;
        }
        return isValid;
    }


    private boolean isValidPhoneNumber(CharSequence phoneNumber) {
        return !TextUtils.isEmpty(phoneNumber) && Patterns.PHONE.matcher(phoneNumber).matches();
    }

    private boolean validateUsingLibPhoneNumber(String countryCode, String phNumber) {
        PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
        //  String isoCode = phoneNumberUtil.getRegionCodeForCountryCode(Integer.parseInt(countryCode));
        Phonenumber.PhoneNumber phoneNumber = null;
        try {
            phoneNumber = phoneNumberUtil.parse(phNumber, countryCode);
//            phoneNumber = phoneNumberUtil.parse(phNumber, isoCode);
        } catch (NumberParseException e) {
            System.err.println(e.getMessage());
        }

        return (phoneNumberUtil.isValidNumber(phoneNumber));
    }

    private void saveUserProfile(ReaderGetProfileResponse data) {
        PrefUtils.setEmail(data.getEmail());
        PrefUtils.setFirstName(data.getFirstName());
        PrefUtils.setLastName(data.getLastName());
        PrefUtils.setMobile(data.getMobile());
        PrefUtils.setCountryCode(data.getCountryCode()+"(+"+dialCode+")");
        PrefUtils.setCountry(data.getCountryCode());
        PrefUtils.setCity(data.getCity());
        PrefUtils.setUserImageUrl(data.getProfileImage());
    }


}
