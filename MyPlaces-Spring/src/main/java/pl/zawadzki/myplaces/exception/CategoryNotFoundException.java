package pl.zawadzki.myplaces.exception;

public class CategoryNotFoundException extends IllegalArgumentException{
    public CategoryNotFoundException(String message) {
        super(message);
    }
}
