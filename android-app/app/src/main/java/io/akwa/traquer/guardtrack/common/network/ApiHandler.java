package io.akwa.traquer.guardtrack.common.network;

import com.google.gson.JsonObject;


import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryImage;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryUpload;
import io.akwa.traquer.guardtrack.common.cognito.ValidateCognitoToken;
import io.akwa.traquer.guardtrack.common.geofence.GeofencDeviceListener;
import io.akwa.traquer.guardtrack.common.geofence.GeofenceApiResponse;
import io.akwa.traquer.guardtrack.common.linkdevice.LinkUnlinkDeviceListener;
import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInfo;
import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInformationResponseListener;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.zone.ZonApiResponse;
import io.akwa.traquer.guardtrack.common.zone.ZoneDeviceListener;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.issueDetail.ReportIssueRequest;
import io.akwa.traquer.guardtrack.issueDetail.ReportShippingIssueResponseListener;
import io.akwa.traquer.guardtrack.listener.ApiListener;
import io.akwa.traquer.guardtrack.listener.CountriesListener;
import io.akwa.traquer.guardtrack.listener.EditProfileResponseListener;
import io.akwa.traquer.guardtrack.listener.ForgotPasswordResponseListener;
import io.akwa.traquer.guardtrack.listener.HtmlContentListener;
import io.akwa.traquer.guardtrack.listener.LoginResponseListener;
import io.akwa.traquer.guardtrack.listener.LogoutResponseListener;
import io.akwa.traquer.guardtrack.listener.NotificationListListener;
import io.akwa.traquer.guardtrack.listener.ResetPasswordListener;
import io.akwa.traquer.guardtrack.listener.SettingsResponseListener;
import io.akwa.traquer.guardtrack.listener.TrackingConfigListner;
import io.akwa.traquer.guardtrack.listener.UpdateSettingsResponseListener;
import io.akwa.traquer.guardtrack.listener.UserProfileResponseListener;
import io.akwa.traquer.guardtrack.listener.ValidateTokenListener;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.CognitoEditProfileRequest;
import io.akwa.traquer.guardtrack.model.CountryApiResponse;
import io.akwa.traquer.guardtrack.model.EditProfileRequest;
import io.akwa.traquer.guardtrack.model.NotificationApiResponse;
import io.akwa.traquer.guardtrack.model.PhoneStatusRequest;
import io.akwa.traquer.guardtrack.model.RemoveNotificationRequest;
import io.akwa.traquer.guardtrack.model.UpdateSettingsRequest;
import io.akwa.traquer.guardtrack.ui.contactsettings.ContactSettingResponseListener;
import io.akwa.traquer.guardtrack.ui.contactsettings.UpdateContactSettingResponse;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.ContactSettingRequest;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.ScanUpdateListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskListListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStartListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TaskStopListener;
import io.akwa.traquer.guardtrack.ui.guardtrack.listeners.TourListListener;
import io.akwa.traquer.guardtrack.ui.home.model.EmpDashboardResponse;
import io.akwa.traquer.guardtrack.ui.home.model.EmpHomeResponseListener;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponseListener;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.UpdateTaskDetailRequestListener;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponse;
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailResponseListener;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportResponse;
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportResponseListener;
import io.akwa.traquer.guardtrack.ui.trackingsetting.TrackingSettingResponseListener;
import io.akwa.traquer.guardtrack.ui.trackingsetting.UpdateTrackingSettingResponseListener;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;
import io.akwa.traquer.guardtrack.ui.trackingsetting.model.UpdateTrackingSetting;
import io.akwa.traquer.guardtrack.updatedevice.DeviceRegisterListener;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ApiHandler {
    ApiListener apiListener = null;
    LoginResponseListener loginResponseListener;
    LogoutResponseListener logoutResponseListener;
    UserProfileResponseListener userProfileResponseListener;
    HtmlContentListener htmlContentListener;
    ForgotPasswordResponseListener forgotPasswordResponseListener;
    ValidateTokenListener validateTokenListener;
    ResetPasswordListener resetPasswordListener;
    SettingsResponseListener settingsResponseListener;
    UpdateSettingsResponseListener updateSettingsResponseListener;
    NotificationListListener notificationListListener;
    TrackingSettingResponseListener trackingSettingResponseListener;
    UpdateContactSettingResponse updateContactSettingResponse;

    UpdateTrackingSettingResponseListener updateTrackingSettingResponseListener;
    EmpHomeResponseListener empHomeResponseListener;
    TimeSheetDetailResponseListener timeSheetDetailResponseListener;
    TimeSheetReportResponseListener timeSheetReportResponseListener;

    GeofencDeviceListener geofencDeviceListener;
    TaskDetailResponseListener taskDetailResponseListener;
    UpdateTaskDetailRequestListener updateTaskDetailRequestListener;

    TaskListListener taskListListener;
    TaskStopListener taskStopListener;
    TaskStartListener taskStartListener;
    ZoneDeviceListener zoneDeviceListener;

    ScanUpdateListener scanUpdateListener;
    ReportShippingIssueResponseListener reportShippingIssueResponseListener;

    TourListListener tourListListener;

    public void setTourListListener(TourListListener tourListListener) {
        this.tourListListener = tourListListener;
    }

    public void setZoneDeviceListener(ZoneDeviceListener zoneDeviceListener) {
        this.zoneDeviceListener = zoneDeviceListener;
    }

    public void setReportShippingIssueResponseListener(ReportShippingIssueResponseListener reportShippingIssueResponseListener) {
        this.reportShippingIssueResponseListener = reportShippingIssueResponseListener;
    }

    public void setScanUpdateListener(ScanUpdateListener scanUpdateListener) {
        this.scanUpdateListener = scanUpdateListener;
    }

    public ApiListener getApiListener() {
        return apiListener;
    }

    public void setTaskStopListener(TaskStopListener taskStopListener) {
        this.taskStopListener = taskStopListener;
    }


    public void setTaskStartListener(TaskStartListener taskStartListener) {
        this.taskStartListener = taskStartListener;
    }

    public void setTaskListListener(TaskListListener taskListListener) {
        this.taskListListener = taskListListener;
    }

    public GeofencDeviceListener getGeofencDeviceListener() {
        return geofencDeviceListener;
    }

    public void setGeofencDeviceListener(GeofencDeviceListener geofencDeviceListener) {
        this.geofencDeviceListener = geofencDeviceListener;


    }
    public void setUpdateTaskDetailRequestListener(UpdateTaskDetailRequestListener updateTaskDetailRequestListener) {
        this.updateTaskDetailRequestListener = updateTaskDetailRequestListener;
    }

    public void setTaskDetailResponseListener(TaskDetailResponseListener taskDetailResponseListener) {
        this.taskDetailResponseListener = taskDetailResponseListener;

    }

    public void setTimeSheetReportResponseListener(TimeSheetReportResponseListener timeSheetReportResponseListener) {
        this.timeSheetReportResponseListener = timeSheetReportResponseListener;
    }

    public void setTimeSheetDetailResponseListener(TimeSheetDetailResponseListener timeSheetDetailResponseListener) {
        this.timeSheetDetailResponseListener = timeSheetDetailResponseListener;
    }

    public void setEmpHomeResponseListener(EmpHomeResponseListener empHomeResponseListener) {
        this.empHomeResponseListener = empHomeResponseListener;
    }

    public UpdateTrackingSettingResponseListener getUpdateTrackingSettingResponseListener() {
        return updateTrackingSettingResponseListener;
    }

    public void setUpdateTrackingSettingResponseListener(UpdateTrackingSettingResponseListener updateTrackingSettingResponseListener) {
        this.updateTrackingSettingResponseListener = updateTrackingSettingResponseListener;
    }

    public UpdateContactSettingResponse getUpdateContactSettingResponse() {
        return updateContactSettingResponse;
    }

    public void setUpdateContactSettingResponse(UpdateContactSettingResponse updateContactSettingResponse) {
        this.updateContactSettingResponse = updateContactSettingResponse;
    }

    ContactSettingResponseListener contactSettingResponseListener;

    public ContactSettingResponseListener getContactSettingResponseListener() {
        return contactSettingResponseListener;
    }

    public void setContactSettingResponseListener(ContactSettingResponseListener contactSettingResponseListener) {
        this.contactSettingResponseListener = contactSettingResponseListener;
    }

    EditProfileResponseListener editProfileResponseListener;
    CountriesListener countriesListener;

    TrackingConfigListner trackingConfigListner;
    DeviceInformationResponseListener deviceInformationResponseListener;
    DeviceRegisterListener deviceRegisterListener;

    LinkUnlinkDeviceListener linkUnlinkDeviceListener;

    public TrackingSettingResponseListener getTrackingSettingResponseListener() {
        return trackingSettingResponseListener;
    }

    public void setTrackingSettingResponseListener(TrackingSettingResponseListener trackingSettingResponseListener) {
        this.trackingSettingResponseListener = trackingSettingResponseListener;
    }

    public void setLinkUnlinkDeviceListener(LinkUnlinkDeviceListener linkUnlinkDeviceListener) {
        this.linkUnlinkDeviceListener = linkUnlinkDeviceListener;
    }



    public void setTrackingConfigListner(TrackingConfigListner trackingConfigListner) {
        this.trackingConfigListner = trackingConfigListner;
    }


    public void setCountriesListener(CountriesListener countriesListener) {
        this.countriesListener = countriesListener;
    }

    public void setEditProfileResponseListener(EditProfileResponseListener editProfileResponseListener) {
        this.editProfileResponseListener = editProfileResponseListener;
    }

    public void setDeviceRegisterListener(DeviceRegisterListener deviceRegisterListener) {
        this.deviceRegisterListener = deviceRegisterListener;
    }

    public void setNotificationListListener(NotificationListListener notificationListListener) {
        this.notificationListListener = notificationListListener;
    }


    public void setDeviceInformationResponseListener(DeviceInformationResponseListener deviceInformationResponseListener) {
        this.deviceInformationResponseListener = deviceInformationResponseListener;
    }

    public static ApiHandler getApiHandler() {
        return new ApiHandler();
    }

    public void setSettingsResponseListener(SettingsResponseListener settingsResponseListener) {
        this.settingsResponseListener = settingsResponseListener;
    }

    public void setUpdateSettingsResponseListener(UpdateSettingsResponseListener updateSettingsResponseListener) {
        this.updateSettingsResponseListener = updateSettingsResponseListener;
    }

    public void setForgotPasswordResponseListener(ForgotPasswordResponseListener forgotPasswordResponseListener) {
        this.forgotPasswordResponseListener = forgotPasswordResponseListener;
    }

    public void setValidateTokenListener(ValidateTokenListener validateTokenListener) {
        this.validateTokenListener = validateTokenListener;
    }

    public void setResetPasswordListener(ResetPasswordListener resetPasswordListener) {
        this.resetPasswordListener = resetPasswordListener;
    }

    public void setHtmlContentListener(HtmlContentListener htmlContentListener) {
        this.htmlContentListener = htmlContentListener;
    }

    public void setLoginResponseListener(LoginResponseListener loginResponseListener) {
        this.loginResponseListener = loginResponseListener;
    }


    public void setApiListener(ApiListener listener) {
        this.apiListener = listener;
    }




    public void setUserProfileResponseListener(UserProfileResponseListener userProfileResponseListener) {
        this.userProfileResponseListener = userProfileResponseListener;
    }

    public void setLogoutResponseListener(LogoutResponseListener logoutResponseListener) {
        this.logoutResponseListener = logoutResponseListener;
    }


    public void linkDevice(final JsonObject code) {
      ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
          @Override
          public void onValidateToken(boolean isValidate) {
              if(isValidate)
              {
                  Call<ApiResponseModel> call = RetrofitRestClient.getInstance().linkDevice(BuildConfig.ENVIRONMENT,code);
                  call.enqueue(new Callback<ApiResponseModel>() {
                      @Override
                      public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                          if (response.isSuccessful()) {
                              linkUnlinkDeviceListener.onDeviceLink(response.body(), null);
                          } else {
                              linkUnlinkDeviceListener.onDeviceLink(null, new NicbitException(ErrorMessage.GSON));
                          }
                      }

                      @Override
                      public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                          if (linkUnlinkDeviceListener != null) {
                              linkUnlinkDeviceListener.onDeviceLink(null, new NicbitException(ErrorMessage.CONNECTION));
                          }
                      }
                  });
              }
              else
              {
                  linkUnlinkDeviceListener.onDeviceLink(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

              }
          }
      });
    }

    public void getGeofence() {
                    Call<GeofenceApiResponse> call = RetrofitRestClient.getInstance().getGeofences(BuildConfig.ENVIRONMENT);
                    call.enqueue(new Callback<GeofenceApiResponse>() {
                        @Override
                        public void onResponse(Call<GeofenceApiResponse> call, Response<GeofenceApiResponse> response) {
                            if (response.isSuccessful()) {
                                geofencDeviceListener.onGeofenceRecived(response.body(), null);
                            } else {
                                geofencDeviceListener.onGeofenceRecived(null, new NicbitException(ErrorMessage.GSON));
                            }
                        }

                        @Override
                        public void onFailure(Call<GeofenceApiResponse> call, Throwable t) {
                            if (geofencDeviceListener != null) {
                                geofencDeviceListener.onGeofenceRecived(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });


    }

    public void getBeaconZone() {
        Call<ZonApiResponse> call = RetrofitRestClient.getInstance().getZones(BuildConfig.ENVIRONMENT);
        call.enqueue(new Callback<ZonApiResponse>() {
            @Override
            public void onResponse(Call<ZonApiResponse> call, Response<ZonApiResponse> response) {
                if (response.isSuccessful()) {
                    zoneDeviceListener.onZoneRecived(response.body(), null);
                } else {
                    zoneDeviceListener.onZoneRecived(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ZonApiResponse> call, Throwable t) {
                if (zoneDeviceListener != null) {
                    zoneDeviceListener.onZoneRecived(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });


    }
    public void unLinkDevice(final JsonObject code) {
        ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if(isValidate)
                {
                    Call<ApiResponseModel> call = RetrofitRestClient.getInstance().unLinkDevice(BuildConfig.ENVIRONMENT,code);
                    call.enqueue(new Callback<ApiResponseModel>() {
                        @Override
                        public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                            if (response.isSuccessful()) {
                                linkUnlinkDeviceListener.onDeviceUnlink(response.body(), null);
                            } else {
                                linkUnlinkDeviceListener.onDeviceUnlink(null, new NicbitException(ErrorMessage.GSON));
                            }
                        }

                        @Override
                        public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                            if (linkUnlinkDeviceListener != null) {
                                linkUnlinkDeviceListener.onDeviceUnlink(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                }
                else
                {
                    linkUnlinkDeviceListener.onDeviceUnlink(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });

    }

    public void getHtml(String type) {
        Call<ApiResponseModel> call = RetrofitRestClient.getInstance().getcontent(PrefUtils.getSessionToken(), type);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                if (response.isSuccessful()) {
                    htmlContentListener.onHtmlReceive(response.body(), null);
                } else {
                    htmlContentListener.onHtmlReceive(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                if (htmlContentListener != null) {
                    htmlContentListener.onHtmlReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });
    }



    public void updateDeviceInformation(DeviceInfo deviceInfor) {
        Call<ApiResponseModel> call = RetrofitRestClient.getInstance().updateDevice(deviceInfor);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                if (response.isSuccessful()) {
                    deviceInformationResponseListener.onDeviceUpdate(response.body(), null);
                } else {
                    deviceInformationResponseListener.onDeviceUpdate(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                if (deviceInformationResponseListener != null) {
                    deviceInformationResponseListener.onDeviceUpdate(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });
    }

    public void registerDevice(DeviceInfo deviceInfor) {
        Call<ApiBaseResponse> call = RetrofitRestClient.getInstance().registerDevice(BuildConfig.ENVIRONMENT,deviceInfor);
        call.enqueue(new Callback<ApiBaseResponse>() {
            @Override
            public void onResponse(Call<ApiBaseResponse> call, Response<ApiBaseResponse> response) {
                if (response.isSuccessful()) {
                    deviceRegisterListener.onDeviceUpdate(response.body(), null);
                } else {
                    deviceRegisterListener.onDeviceUpdate(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiBaseResponse> call, Throwable t) {
                if (deviceRegisterListener != null) {
                    deviceRegisterListener.onDeviceUpdate(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });
    }




    public void searchCases(String query) {
        Call<ApiResponseModel> call = RetrofitRestClient.getInstance().searchCases(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), query);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                if (response.isSuccessful()) {
                    apiListener.onApiResponse(response.body(), null);
                } else {
                    apiListener.onApiResponse(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                if (apiListener != null) {
                    apiListener.onApiResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });
    }

    public void getSettings() {
       ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
           @Override
           public void onValidateToken(boolean isValidate) {
               if(isValidate)
               {
                   Call<ApiResponseModel> call = RetrofitRestClient.getInstance().getSettings(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken());
                   call.enqueue(new Callback<ApiResponseModel>() {
                       @Override
                       public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                           if (response.isSuccessful()) {
                               settingsResponseListener.onSettingsResponseReceive(response.body(), null);
                           } else {
                               settingsResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                           }
                       }

                       @Override
                       public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                           if (settingsResponseListener != null) {
                               settingsResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                           }
                       }
                   });
               }
               else
               {
                   settingsResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

               }
           }
       });
    }

    public void getTrackingSetting() {
       ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
           @Override
           public void onValidateToken(boolean isValidate) {
               if(isValidate)
               {
                   Call<GetTrackingSettingResponse> call = RetrofitRestClient.getInstance().getTrackingSetting(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken());
                   call.enqueue(new Callback<GetTrackingSettingResponse>() {
                       @Override
                       public void onResponse(Call<GetTrackingSettingResponse> call, Response<GetTrackingSettingResponse> response) {
                           if (response.isSuccessful()) {
                               trackingSettingResponseListener.onSettingsResponseReceive(response.body(), null);
                           } else {
                               trackingSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                           }
                       }

                       @Override
                       public void onFailure(Call<GetTrackingSettingResponse> call, Throwable t) {
                           if (trackingSettingResponseListener != null) {
                               trackingSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                           }
                       }
                   });
               }
               else
               {
                   trackingSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

               }
           }
       });
    }


    public void getContactSettings() {

        ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {

                if(isValidate)
                {
                    Call<GetContactSettingsResponse> call = RetrofitRestClient.getInstance().getContactSetting(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken());
                    call.enqueue(new Callback<GetContactSettingsResponse>() {
                        @Override
                        public void onResponse(Call<GetContactSettingsResponse> call, Response<GetContactSettingsResponse> response) {
                            if (response.isSuccessful()) {
                                contactSettingResponseListener.onSettingsResponseReceive(response.body(), null);
                            } else {
                                contactSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                            }
                        }

                        @Override
                        public void onFailure(Call<GetContactSettingsResponse> call, Throwable t) {
                            if (contactSettingResponseListener != null) {
                                contactSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                }
                else
                {
                    contactSettingResponseListener.onSettingsResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }
            }
        });
    }
    public void updateSettings(final UpdateSettingsRequest updateSettingsRequest) {
        ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if(isValidate)
                {
                    Call<ApiResponseModel> call = RetrofitRestClient.getInstance().updateSettings(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), updateSettingsRequest);
                    call.enqueue(new Callback<ApiResponseModel>() {
                        @Override
                        public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                            if (updateSettingsResponseListener != null) {
                                if (response.isSuccessful()) {
                                    updateSettingsResponseListener.onUpdateSettingsResponseReceive(response.body(), null);
                                } else {
                                    updateSettingsResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                            if (updateSettingsResponseListener != null) {
                                updateSettingsResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                }
                else
                {
                    updateSettingsResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });

    }

    public void updateTrackingSetting(final UpdateTrackingSetting updateSettingsRequest) {
      ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
          @Override
          public void onValidateToken(boolean isValidate) {
              if(isValidate)
              {
                  Call<GetTrackingSettingResponse> call = RetrofitRestClient.getInstance().updateTrackingSetting(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), updateSettingsRequest);
                  call.enqueue(new Callback<GetTrackingSettingResponse>() {
                      @Override
                      public void onResponse(Call<GetTrackingSettingResponse> call, Response<GetTrackingSettingResponse> response) {
                          if (updateTrackingSettingResponseListener != null) {
                              if (response.isSuccessful()) {
                                  updateTrackingSettingResponseListener.onUpdateSettingsResponseReceive(response.body(), null);
                              } else {
                                  updateTrackingSettingResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                              }
                          }
                      }

                      @Override
                      public void onFailure(Call<GetTrackingSettingResponse> call, Throwable t) {
                          if (updateTrackingSettingResponseListener != null) {
                              updateTrackingSettingResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                          }
                      }
                  });
              }
              else
              {
                  updateTrackingSettingResponseListener.onUpdateSettingsResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

              }

          }
      });
    }
    public void updateContactSetting(final ContactSettingRequest updateSettingsRequest) {
      ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
          @Override
          public void onValidateToken(boolean isValidate) {
              if(isValidate)
              {
                  Call<GetContactSettingsResponse> call = RetrofitRestClient.getInstance().updateContactSettings(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), updateSettingsRequest);
                  call.enqueue(new Callback<GetContactSettingsResponse>() {
                      @Override
                      public void onResponse(Call<GetContactSettingsResponse> call, Response<GetContactSettingsResponse> response) {
                          if (updateContactSettingResponse != null) {
                              if (response.isSuccessful()) {
                                  updateContactSettingResponse.onUpdateContactSetting(response.body(), null);
                              } else {
                                  updateContactSettingResponse.onUpdateContactSetting(null, new NicbitException(ErrorMessage.GSON));
                              }
                          }
                      }

                      @Override
                      public void onFailure(Call<GetContactSettingsResponse> call, Throwable t) {
                          if (updateContactSettingResponse != null) {
                              updateContactSettingResponse.onUpdateContactSetting(null, new NicbitException(ErrorMessage.CONNECTION));
                          }
                      }
                  });
              }
              else
              {
                  updateContactSettingResponse.onUpdateContactSetting(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

              }
          }
      });
    }



    public void getNotifications() {
      ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
          @Override
          public void onValidateToken(boolean isValidate) {
              if(isValidate)
              {
                  Call<NotificationApiResponse> call = RetrofitRestClient.getInstance().getNotifications(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(),1);
                  call.enqueue(new Callback<NotificationApiResponse>() {
                      @Override
                      public void onResponse(Call<NotificationApiResponse> call, Response<NotificationApiResponse> response) {
                          if (response.isSuccessful()) {
                              notificationListListener.onNotificationListReceive(response.body(), null);
                          } else {
                              notificationListListener.onNotificationListReceive(null, new NicbitException(ErrorMessage.GSON));
                          }
                      }

                      @Override
                      public void onFailure(Call<NotificationApiResponse> call, Throwable t) {
                          if (notificationListListener != null) {
                              notificationListListener.onNotificationListReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                          }
                      }
                  });
              }
              else
              {
                  notificationListListener.onNotificationListReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

              }
          }
      });
    }


    public void doTimeZone(String timeZone) {
        EditProfileRequest model = new EditProfileRequest();
        model.setTimezone(timeZone);
        setTimeZone(model);
    }

    public void setTimeZone(EditProfileRequest timeZone) {
        Call<ApiResponseModel> call = RetrofitRestClient.getInstance().editProfile(PrefUtils.getSessionToken(), timeZone);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                if (response.isSuccessful()) {
                    apiListener.onApiResponse(response.body(), null);
                } else {
                    apiListener.onApiResponse(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                if (apiListener != null) {
                    apiListener.onApiResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });
    }

    public void doEditRequest(Integer isImageRemove, String city, String password, String firstName, String lastName, String mobileNo, String countryCode, File file) {


        final CognitoEditProfileRequest editProfileRequest=new CognitoEditProfileRequest();
        editProfileRequest.setMobileNumber(mobileNo);
        editProfileRequest.setGiven_name(firstName);
        editProfileRequest.setFamily_name(lastName);
        editProfileRequest.setCountryCode(countryCode);
        editProfileRequest.setDeleteProfileImage(isImageRemove);
        editProfileRequest.setEmail(PrefUtils.getEmail());
        editProfileRequest.setMobileCode(countryCode);
        if(file!=null)
        {
            List<String> imagePaths=new ArrayList<>();
            imagePaths.add(file.getAbsolutePath());
            new CloudinaryUpload(null, imagePaths, new CloudinaryUpload.CloudanaryCallBack() {
                @Override
                public void onUploadImages(List<CloudinaryImage> imageList, String error) {
                    if (imageList != null && imageList.size() > 0) {
                        editProfileRequest.setPicture(imageList.get(0).getUrl());
                        PrefUtils.setUserImageUrl(imageList.get(0).getUrl());
                        getUpdateDataFromApi(editProfileRequest);

                    } else {
                        editProfileRequest.setPicture(PrefUtils.getUserImageUrl());
                        getUpdateDataFromApi(editProfileRequest);
                    }

                }
            }).uploadImage();
        }
        else
        {
            if(isImageRemove==1) {
                PrefUtils.setUserImageUrl("");
                editProfileRequest.setPicture("");
            }
            else
            editProfileRequest.setPicture(PrefUtils.getUserImageUrl());

            getUpdateDataFromApi(editProfileRequest);
        }

     /*   EditProfileRequest editProfileRequest = new EditProfileRequest();
        editProfileRequest.setcity(city);
        editProfileRequest.setPassword(password);
        editProfileRequest.setMobileNo(mobileNo);
        editProfileRequest.setFirstName(firstName);
        editProfileRequest.setLastName(lastName);
        editProfileRequest.setCountryCode(countryCode);
        editProfileRequest.setDeleteProfileImage(isImageRemove);
        getUpdateDataFromApi(editProfileRequest, file);*/
    }

    public void getUpdateDataFromApi(/*EditProfileRequest editProfileRequest*/ final CognitoEditProfileRequest editProfileRequest) {

         ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
             @Override
             public void onValidateToken(boolean isValidate) {
                 if(isValidate)
                 {

                     Call<ApiResponseModel> call = RetrofitRestClient.getInstance().updateProfileCognito(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(),editProfileRequest);
                     call.enqueue(new Callback<ApiResponseModel>() {
                         @Override
                         public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                             if (response.isSuccessful()) {
                                 editProfileResponseListener.onEditProfileResponse(response.body(), null);
                             } else {
                                 ApiResponseModel apiResponseModel=new ApiResponseModel();
                                 apiResponseModel.setCode(response.code());
                                 editProfileResponseListener.onEditProfileResponse(apiResponseModel,null);
                             }
                         }

                         @Override
                         public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                             if (editProfileResponseListener != null) {
                                 editProfileResponseListener.onEditProfileResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                             }
                         }
                     });
                 }
                 else
                 {
                     editProfileResponseListener.onEditProfileResponse(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                 }
             }
         });

        /* ApiService service =
                MultipartRetrofitRestClient.getInstance();
        MultipartBody.Part body = null;
        if (file != null) {
            RequestBody requestFile =
                    RequestBody.create(MediaType.parse("multipart/form-data"), file);
            body = MultipartBody.Part.createFormData("profileImage", file.getDate(), requestFile);
        }

        RequestBody city =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getcity());

        RequestBody password =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getPassword());

        RequestBody firstName =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getFirstName());

        RequestBody lastName =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getLastName());

        RequestBody mobileNo =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getMobileNo());

        RequestBody countryCode =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getCountryCode());
        RequestBody deleteProfileImage =
                RequestBody.create(
                        MediaType.parse("multipart/form-data"), editProfileRequest.getDeleteProfileImage() + "");


        // finally, execute the request
        Call<ApiResponseModel> call = service.updateProfile(PrefUtils.getSessionToken(), city, password, firstName, lastName, mobileNo, countryCode, deleteProfileImage, body);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                if (response.isSuccessful()) {
                    editProfileResponseListener.onEditProfileResponse(response.body(), null);
                } else {
                    editProfileResponseListener.onEditProfileResponse(null, new NicbitException(ErrorMessage.GSON));
                }
            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                if (editProfileResponseListener != null) {
                    editProfileResponseListener.onEditProfileResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                }
            }
        });*/
    }



    private RequestBody createPartFromString(String descriptionString) {
        String MULTIPART_FORM_DATA = "multipart/form-data";
        return RequestBody.create(
                MediaType.parse(MULTIPART_FORM_DATA), descriptionString);
    }


    public void getCountries() {
     ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
         @Override
         public void onValidateToken(boolean isValidate) {
             if(isValidate)
             {
                 Call<CountryApiResponse> call = RetrofitRestClient.getInstance().getCountries(BuildConfig.ENVIRONMENT);
                 call.enqueue(new Callback<CountryApiResponse>() {
                     @Override
                     public void onResponse(Call<CountryApiResponse> call, Response<CountryApiResponse> response) {
                         if (response.isSuccessful()) {
                             countriesListener.onCountriesResponse(response.body(), null);
                         } else {
                             countriesListener.onCountriesResponse(null, new NicbitException(ErrorMessage.GSON));
                         }
                     }

                     @Override
                     public void onFailure(Call<CountryApiResponse> call, Throwable t) {
                         if (countriesListener != null) {
                             countriesListener.onCountriesResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                         }
                     }
                 });
             }
             else
             {
                 countriesListener.onCountriesResponse(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

             }
         }
     });

    }



    public void getTrackingConfig(final String app) {
      ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
          @Override
          public void onValidateToken(boolean isValidate) {
              if(isValidate)
              {
                  Call<ApiResponseModel> call = RetrofitRestClient.getInstance().getTrackingConfigurations(PrefUtils.getSessionToken(), app);
                  call.enqueue(new Callback<ApiResponseModel>() {
                      @Override
                      public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                          if (response.isSuccessful() && trackingConfigListner != null) {
                              trackingConfigListner.onTrackingConfig(response.body(), null);
                          } else {
                              trackingConfigListner.onTrackingConfig(null, new NicbitException(ErrorMessage.GSON));
                          }


                      }

                      @Override
                      public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                          if (trackingConfigListner != null) {
                              trackingConfigListner.onTrackingConfig(null, new NicbitException(ErrorMessage.CONNECTION));
                          }


                      }
                  });

              }
              else
              {
                  trackingConfigListner.onTrackingConfig(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

              }
          }
      });
    }




    public void updatePhoneStatus(PhoneStatusRequest phoneStatusRequest) {
        Call<ApiResponseModel> call = RetrofitRestClient.getInstance().phoneStatus(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), phoneStatusRequest);
        call.enqueue(new Callback<ApiResponseModel>() {
            @Override
            public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {



            }

            @Override
            public void onFailure(Call<ApiResponseModel> call, Throwable t) {



            }
        });

    }

    public void getDashboardData(final String data) {
        ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if(isValidate)
                {
                    Call<EmpDashboardResponse> call = RetrofitRestClient.getInstance().getDashboardData(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), data);
                    call.enqueue(new Callback<EmpDashboardResponse>() {
                        @Override
                        public void onResponse(Call<EmpDashboardResponse> call, Response<EmpDashboardResponse> response) {
                            if (empHomeResponseListener!= null) {
                                if (response.isSuccessful()) {
                                    empHomeResponseListener.onDashboardResponseReceive(response.body(), null);
                                } else {
                                    empHomeResponseListener.onDashboardResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<EmpDashboardResponse> call, Throwable t) {
                            if (empHomeResponseListener != null) {
                                empHomeResponseListener.onDashboardResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                }
                else
                {
                    empHomeResponseListener.onDashboardResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void getTimeSheetDetail(final String data) {
        ValidateCognitoToken validateCognitoToken = new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TimeSheetDetailResponse> call = RetrofitRestClient.getInstance().getTimeSheetDetail(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(), data);
                    call.enqueue(new Callback<TimeSheetDetailResponse>() {
                        @Override
                        public void onResponse(Call<TimeSheetDetailResponse> call, Response<TimeSheetDetailResponse> response) {
                            if (timeSheetDetailResponseListener != null) {
                                if (response.isSuccessful()) {
                                    timeSheetDetailResponseListener.onTimeSheetDetailResponseReceive(response.body(), null);
                                } else {
                                    timeSheetDetailResponseListener.onTimeSheetDetailResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TimeSheetDetailResponse> call, Throwable t) {
                            if (timeSheetDetailResponseListener != null) {
                                timeSheetDetailResponseListener.onTimeSheetDetailResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    timeSheetDetailResponseListener.onTimeSheetDetailResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }


    public void getTaskDetail(final String taskId) {
        ValidateCognitoToken validateCognitoToken = new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TaskDetailResponse> call = RetrofitRestClient.getInstance().getTaskDetail(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(), taskId);
                    call.enqueue(new Callback<TaskDetailResponse>() {
                        @Override
                        public void onResponse(Call<TaskDetailResponse> call, Response<TaskDetailResponse> response) {
                            if (taskDetailResponseListener != null) {
                                if (response.isSuccessful()) {
                                    taskDetailResponseListener.onTaskDetailResponseReceive(response.body(), null);
                                } else {
                                    taskDetailResponseListener.onTaskDetailResponseReceive(response.body(), null);
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TaskDetailResponse> call, Throwable t) {
                            if (taskDetailResponseListener != null) {
                                taskDetailResponseListener.onTaskDetailResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    taskDetailResponseListener.onTaskDetailResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }


    public void getTasks() {
         new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TaskListApiResponse> call = RetrofitRestClient.getInstance().getTasks(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken());
                    call.enqueue(new Callback<TaskListApiResponse>() {
                        @Override
                        public void onResponse(Call<TaskListApiResponse> call, Response<TaskListApiResponse> response) {
                            if (taskListListener != null) {
                                if (response.isSuccessful()) {
                                    taskListListener.onTasksResponseListener(response.body(), null);
                                } else {
                                    taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TaskListApiResponse> call, Throwable t) {
                            if (taskListListener != null) {
                                taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void getTourss() {
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TaskListApiResponse> call = RetrofitRestClient.getInstance().getTourss(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken());
                    call.enqueue(new Callback<TaskListApiResponse>() {
                        @Override
                        public void onResponse(Call<TaskListApiResponse> call, Response<TaskListApiResponse> response) {
                            if (taskListListener != null) {
                                if (response.isSuccessful()) {
                                    taskListListener.onTasksResponseListener(response.body(), null);
                                } else {

                                    taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TaskListApiResponse> call, Throwable t) {
                            if (taskListListener != null) {
                                taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    taskListListener.onTasksResponseListener(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void startTask(final Map<String,Object> taskID) {
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TaskStartApiResponse> call = RetrofitRestClient.getInstance().startTask(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(),taskID);
                    call.enqueue(new Callback<TaskStartApiResponse>() {
                        @Override
                        public void onResponse(Call<TaskStartApiResponse> call, Response<TaskStartApiResponse> response) {
                            if (taskStartListener != null) {
                                if (response.isSuccessful()) {
                                    taskStartListener.onTaskStart(response.body(), null);
                                } else {
                                    taskStartListener.onTaskStart(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TaskStartApiResponse> call, Throwable t) {
                            if (taskStartListener != null) {
                                taskStartListener.onTaskStart(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    taskStartListener.onTaskStart(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void updateScan(final ScanRequest scanRequest) {
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<ScanResponse> call = RetrofitRestClient.getInstance().updateScan(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(),scanRequest);
                    call.enqueue(new Callback<ScanResponse>() {
                        @Override
                        public void onResponse(Call<ScanResponse> call, Response<ScanResponse> response) {
                            if (scanUpdateListener != null) {
                                if (response.isSuccessful()) {
                                    scanUpdateListener.onScanUpdate(response.body(), null);
                                } else {
                                    scanUpdateListener.onScanUpdate(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<ScanResponse> call, Throwable t) {
                            if (taskStartListener != null) {
                                scanUpdateListener.onScanUpdate(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    scanUpdateListener.onScanUpdate(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }


    public void getTous(final int offset, final int limit, final String sort, final String toruID) {
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TourApiResponse> call = RetrofitRestClient.getInstance().getTours(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(),offset,limit,sort,toruID);
                    call.enqueue(new Callback<TourApiResponse>() {
                        @Override
                        public void onResponse(Call<TourApiResponse> call, Response<TourApiResponse> response) {
                            if (tourListListener != null) {
                                if (response.isSuccessful()) {
                                    tourListListener.onTourResponse(response.body(), null);
                                } else {
                                    tourListListener.onTourResponse(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TourApiResponse> call, Throwable t) {
                            if (tourListListener != null) {
                                tourListListener.onTourResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    tourListListener.onTourResponse(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }


    public void stopTask(final Map<String,Object> taskID) {
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TaskStopApiResponse> call = RetrofitRestClient.getInstance().stopTask(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(),taskID);
                    call.enqueue(new Callback<TaskStopApiResponse>() {
                        @Override
                        public void onResponse(Call<TaskStopApiResponse> call, Response<TaskStopApiResponse> response) {
                            if (taskStopListener != null) {
                                if (response.isSuccessful()) {
                                    taskStopListener.onTaskStop(response.body(), null);
                                } else {
                                    taskStopListener.onTaskStop(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TaskStopApiResponse> call, Throwable t) {
                            if (taskStopListener != null) {
                                taskStopListener.onTaskStop(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    taskStopListener.onTaskStop(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void updateTaskDetail(final String taskId,final TaskDetailUpdateRequest taskDetailUpdateRequest) {
        ValidateCognitoToken validateCognitoToken = new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<ApiResponseModel> call = RetrofitRestClient.getInstance().updateTaskDetail(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(), taskId,1,taskDetailUpdateRequest);
                    call.enqueue(new Callback<ApiResponseModel>() {
                        @Override
                        public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                            if (updateTaskDetailRequestListener != null) {
                                if (response.isSuccessful()) {
                                    updateTaskDetailRequestListener.onTaskDetailUpdated(response.body(), null);
                                } else {
                                    updateTaskDetailRequestListener.onTaskDetailUpdated(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                            if (updateTaskDetailRequestListener != null) {
                                updateTaskDetailRequestListener.onTaskDetailUpdated(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    updateTaskDetailRequestListener.onTaskDetailUpdated(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }

    public void getTimeSheetReport(final String fromDate,final String toDate) {
        ValidateCognitoToken validateCognitoToken = new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<TimeSheetReportResponse> call = RetrofitRestClient.getInstance().getTimeSheetReport(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(),fromDate,toDate);
                    call.enqueue(new Callback<TimeSheetReportResponse>() {
                        @Override
                        public void onResponse(Call<TimeSheetReportResponse> call, Response<TimeSheetReportResponse> response) {
                            if (timeSheetReportResponseListener != null) {
                                if (response.isSuccessful()) {
                                    timeSheetReportResponseListener.onTimeSheetReportResponseReceive(response.body(), null);
                                } else {
                                    timeSheetReportResponseListener.onTimeSheetReportResponseReceive(null, new NicbitException(ErrorMessage.GSON));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<TimeSheetReportResponse> call, Throwable t) {
                            if (timeSheetReportResponseListener != null) {
                                timeSheetReportResponseListener.onTimeSheetReportResponseReceive(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    timeSheetReportResponseListener.onTimeSheetReportResponseReceive(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }

            }
        });
    }
    public void removeNotification(final  RemoveNotificationRequest removeNotificationRequest) {
       ValidateCognitoToken validateCognitoToken=new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
           @Override
           public void onValidateToken(boolean isValidate) {
               if(isValidate)
               {
                   Call<NotificationApiResponse> call = RetrofitRestClient.getInstance().removeNotifications(BuildConfig.ENVIRONMENT,PrefUtils.getSessionToken(), removeNotificationRequest);
                   call.enqueue(new Callback<NotificationApiResponse>() {
                       @Override
                       public void onResponse(Call<NotificationApiResponse> call, Response<NotificationApiResponse> response) {
                           if (response.isSuccessful()) {
                               notificationListListener.onNotificationRemove(response.body(), null);
                           } else {
                               notificationListListener.onNotificationRemove(null, new NicbitException(ErrorMessage.GSON));
                           }
                       }

                       @Override
                       public void onFailure(Call<NotificationApiResponse> call, Throwable t) {
                           if (notificationListListener != null) {
                               notificationListListener.onNotificationRemove(null, new NicbitException(ErrorMessage.CONNECTION));
                           }
                       }
                   });
               }
               else
               {
                   notificationListListener.onNotificationRemove(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

               }
           }
       });
    }

    public void reportItemComment(final ReportIssueRequest reportIssueRequest) {
      /*  ApiService service = MultipartRetrofitRestClient.getInstance();
        ArrayList<MultipartBody.Part> list = new ArrayList<>();
        for (SelectedImage selectedImage : images) {
            RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), selectedImage.getFile());
            MultipartBody.Part body = MultipartBody.Part.createFormData("images[]", selectedImage.getFile().getName(), requestFile);
            list.add(body);
        }

        HashMap<String, RequestBody> map = new HashMap<>();
        map.put("caseNo", createPartFromString(reportIssueRequest.getCaseNo()));
        map.put("skuId", createPartFromString(reportIssueRequest.getSkuId()));
        map.put("comment", createPartFromString(reportIssueRequest.getComment()));
*/

        // finally, execute the request
        new ValidateCognitoToken(new ValidateCognitoToken.UserTokenListener() {
            @Override
            public void onValidateToken(boolean isValidate) {
                if (isValidate) {
                    Call<ApiResponseModel> call = RetrofitRestClient.getInstance().reportItemComments(BuildConfig.ENVIRONMENT, PrefUtils.getSessionToken(), reportIssueRequest);
                    call.enqueue(new Callback<ApiResponseModel>() {
                        @Override
                        public void onResponse(Call<ApiResponseModel> call, Response<ApiResponseModel> response) {
                            if (response.isSuccessful()) {
                                reportShippingIssueResponseListener.onReportShippingIssueResponse(response.body(), null);
                            } else {
                                reportShippingIssueResponseListener.onReportShippingIssueResponse(null, new NicbitException(ErrorMessage.GSON));
                            }
                        }

                        @Override
                        public void onFailure(Call<ApiResponseModel> call, Throwable t) {
                            if (reportShippingIssueResponseListener != null) {
                                reportShippingIssueResponseListener.onReportShippingIssueResponse(null, new NicbitException(ErrorMessage.CONNECTION));
                            }
                        }
                    });
                } else {
                    reportShippingIssueResponseListener.onReportShippingIssueResponse(null, new NicbitException(ErrorMessage.SYNC_TOKEN_ERROR));

                }
            }
        });
    }

}

