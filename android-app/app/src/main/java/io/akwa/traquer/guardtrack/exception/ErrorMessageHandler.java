package io.akwa.traquer.guardtrack.exception;

import android.app.Activity;

import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;


public class ErrorMessageHandler {

    public static void handleErrorMessage(Integer errorCode, Activity context) {
        DialogClass.dismissDialog(context);
        Error error;
        switch (errorCode) {
            case 200:
                error = Error.READER_SIGNUP_EMAIL_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 201:
                error = Error.READER_SIGNUP_PASSWORD_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 202:
                error = Error.READER_SIGNUP_INVALID_EMAIL;
                DialogClass.alerDialog(context, error.getDescription());
                break;

            case 203:
                error = Error.READER_SIGNUP_CONSUMER_EXISTS;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 204:
                error = Error.READER_SIGNIN_EMAIL_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 205:
                error = Error.READER_SIGNIN_PASSWORD_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 206:
                error = Error.READER_SIGNIN_DEVICEID_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;

            case 207:
                error = Error.READER_LOGIN_FAILED;
                DialogClass.alerDialog(context, error.getDescription());
                break;

            case 208:
                logout(context);
                break;

            case 209:
                logout(context);


            case 210:
                logout(context);
                break;
            case 211:
                error = Error.READER_INVALID_CLIENT;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 212:
                error = Error.READER_REQUEST_ID_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;

            case 213:
                error = Error.READER_INVALID_REQUEST_ID;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 214:
                error = Error.READER_STATUS_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 215:
                error = Error.READER_FLAG_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 216:
                error = Error.READER_SUMMARY_MANDATORY;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 217:
                error = Error.READER_INVALID_FLAG;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 227:
                error = Error.ERR_READER_FORGETPASSWORD_EMAIL_REQUIRED;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 228:
                error = Error.ERR_READER_FORGETPASSWORD_EMAIL_NOT_FOUND;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 229:
                error = Error.ERR_READER_FORGOTTOKEN_REQUIRED;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 230:
                error = Error.ERR_READER_FORGETTOKEN_MISMATCH;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 231:
                error = Error.ERR_READER_FORGETTOKEN_EXPIRED;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 232:
                error = Error.ERR_READER_FORGOT_PASSWORD_REQUIRED;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 304:
                logout(context);
                break;
            case 983:
                error = Error.ERR_APPTYPE_MISMATCH;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 321:
                error = Error.ERR_MR_MISMATCH;
                DialogClass.alerDialog(context, error.getDescription());
                break;
            case 404:
                error = Error.NO_DATA_FOUND;
                DialogClass.alerDialog(context, error.getDescription());
                break;

            case 500:
                logout(context);
                break;
            default:
                error = Error.SYSTEM_ERROR;
                DialogClass.alerDialog(context, error.getDescription());

        }
    }

    public static void logout(Activity context) {

            ((BaseActivity) context).directLogout();

    }

}
