package pl.zawadzki.myplaces.service;

import org.springframework.stereotype.Service;
import pl.zawadzki.myplaces.enums.MarkerCategory;
import pl.zawadzki.myplaces.exception.CategoryNotFoundException;
import pl.zawadzki.myplaces.exception.DifferentUserMarkerException;
import pl.zawadzki.myplaces.exception.MarkerNotFoundException;
import pl.zawadzki.myplaces.model.Marker;
import pl.zawadzki.myplaces.repository.MarkerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MarkerService {

    private MarkerRepository markerRepository;
    private CurrentUserService currentUserService;

    public MarkerService(MarkerRepository markerRepository, CurrentUserService currentUserService) {
        this.markerRepository = markerRepository;
        this.currentUserService = currentUserService;
    }

    public Marker getMarker(Long id) {
        Optional<Marker> optionalMarker = markerRepository.findById(id);
        Marker marker = optionalMarker.orElseThrow(
                () -> new MarkerNotFoundException("Marker with id: " + id + " does not exist!"));
        if (!marker.getUserId().equals(currentUserService.getCurrentUser().getUserId())) {
            throw new DifferentUserMarkerException("This marker was created by different user!");
        }
        return marker;
    }

    public void createNewMarker(Marker marker) {
        marker.setUserId(currentUserService.getCurrentUser().getUserId());
        markerRepository.save(marker);
    }

    public void deleteMarker(Long id) {
        Optional<Marker> optionalMarker = markerRepository.findById(id);
        Marker marker = optionalMarker.orElseThrow(
                () -> new MarkerNotFoundException("Marker with id: " + id + " does not exist!"));
        markerRepository.delete(marker);
    }

    public List<Marker> getUserMarkers() {
        return markerRepository.findAllByUserId(currentUserService.getCurrentUser().getUserId());
    }

    public List<Marker> getUserMarkersByCategory(String category) {
        if (!isEnumCorrect(category)) {
            throw new CategoryNotFoundException("Category " + category + " does not exist!");
        }
        return markerRepository.findAllByUserIdAndCategory(
                currentUserService.getCurrentUser().getUserId(), MarkerCategory.valueOf(category.toUpperCase()));
    }

    private boolean isEnumCorrect(String e) {
        for (MarkerCategory v : MarkerCategory.values()) {
            if (v.getCategory().equalsIgnoreCase(e))
                return true;
        }
        return false;
    }


}
