package io.akwa.traquer.guardtrack.exception;

public enum Error {

    NOT_VALID_JSON(11, "Not Valid Json"),
    SYSTEM_ERROR(0, "System Error"),
    ACTION_REQUIRED(12, "Actions Required"),
    ACTION_NOT_IMPLEMENTED(13, "Actions Not Implemented"),
    REQUEST_METHOD_NOT_ALLOWED(14, "Request method not allowed"),
    READER_SIGNUP_EMAIL_MANDATORY(200, "Signup email mandatory"),
    READER_SIGNUP_PASSWORD_MANDATORY(201, "Signup password mandatory"),
    READER_SIGNUP_INVALID_EMAIL(202, "Signup invalid email"),
    READER_SIGNUP_CONSUMER_EXISTS(203, "Email id is already registered."),
    READER_SIGNIN_EMAIL_MANDATORY(204, "Email Mandatory"),
    READER_SIGNIN_PASSWORD_MANDATORY(205, "Password mandatory"),
    READER_SIGNIN_DEVICEID_MANDATORY(206, "Not Valid Json"),
    READER_LOGIN_FAILED(207, "Login Failed"),
    READER_INVALID_PERM_TOKEN(208, "Invalid Token"),
    READER_AUTH_FAILED(209, "Authentication Failed"),
    READER_SESSION_EXPIRED(210, "Session expired"),
    READER_INVALID_CLIENT(211, "Not a valid client"),
    READER_REQUEST_ID_MANDATORY(212, "Not Valid Json"),
    READER_INVALID_REQUEST_ID(213, "Request Id not Valid"),
    READER_STATUS_MANDATORY(214, "Status Mandatory"),
    READER_FLAG_MANDATORY(215, "Not Valid Json"),
    READER_SUMMARY_MANDATORY(216, "Not Valid Json"),
    READER_INVALID_FLAG(217, "Not Valid Json"),
    ERR_READER_FORGETPASSWORD_EMAIL_REQUIRED(227, "Email Required"),
    ERR_READER_FORGETPASSWORD_EMAIL_NOT_FOUND(228, "Email not found"),
    ERR_READER_FORGOTTOKEN_REQUIRED(229, "Token Required"),
    ERR_READER_FORGETTOKEN_MISMATCH(230, "Code Mismatch"),
    ERR_READER_FORGETTOKEN_EXPIRED(231, "Token Expired"),
    ERR_READER_FORGOT_PASSWORD_REQUIRED(232, "Password Required"),
    ERR_APPTYPE_MISMATCH(983, "This is a Nicbit tag but can't be read by this application"),
    ERR_MR_MISMATCH(321, "Scanned Product assigned to other MR"),
    NO_DATA_FOUND(404, "No data found");


    private final int code;
    private final String description;

    Error(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String toString() {
        return code + ": " + description;
    }

}
