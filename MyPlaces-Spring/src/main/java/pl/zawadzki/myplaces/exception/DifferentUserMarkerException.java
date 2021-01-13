package pl.zawadzki.myplaces.exception;

public class DifferentUserMarkerException extends RuntimeException {
    public DifferentUserMarkerException(String message) {
        super(message);
    }
}
