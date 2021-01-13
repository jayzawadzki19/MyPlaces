package pl.zawadzki.myplaces.exception;

public class MarkerNotFoundException extends RuntimeException{
    public MarkerNotFoundException(String message) {
        super(message);
    }
}
