package io.akwa.traquer.guardtrack.exception;

public class NicbitException extends Exception {


    private static final long serialVersionUID = 1L;
    private ErrorMessage errorMessage;

    public NicbitException(ErrorMessage message) {
        this.errorMessage = message;
    }

    public NicbitException() {

    }

    public ErrorMessage getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(ErrorMessage errorMessage) {
        this.errorMessage = errorMessage;
    }
}
