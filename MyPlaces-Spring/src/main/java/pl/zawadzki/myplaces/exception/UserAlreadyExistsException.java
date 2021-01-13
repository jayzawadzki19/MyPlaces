package pl.zawadzki.myplaces.exception;

public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(String m) {
        super(m);
    }
}
