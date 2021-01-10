package pl.zawadzki.myplaces.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Objects;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "markers")
public class Marker {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Latitude can not be blank")
    private double latitude;

    @NotBlank(message = "Longitude can not be blank")
    private double longitude;

    @NotBlank(message = "Title can not be blank")
    private String title;

    private String description;

    public void setCoordinates(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Marker marker = (Marker) o;
        return Double.compare(marker.latitude, latitude) == 0 && Double.compare(marker.longitude, longitude) == 0 && id.equals(marker.id) && title.equals(marker.title) && Objects.equals(description, marker.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, latitude, longitude, title, description);
    }
}
