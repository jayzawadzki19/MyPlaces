package pl.zawadzki.myplaces.enums;

public enum MarkerCategory {
    FOOD("Food"),
    FREE_TIME("FreeTime"),
    OTHER("Other"),
    SERVICES("Services"),
    SHOPPING("Shopping"),
    WORK("Work");

    private final String category;

    MarkerCategory(String category) {
        this.category = category;
    }

    public String getCategory() {
        return category;
    }
}
