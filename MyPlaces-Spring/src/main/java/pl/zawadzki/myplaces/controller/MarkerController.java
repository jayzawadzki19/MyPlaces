package pl.zawadzki.myplaces.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.zawadzki.myplaces.exception.CategoryNotFoundException;
import pl.zawadzki.myplaces.exception.DifferentUserMarkerException;
import pl.zawadzki.myplaces.exception.MarkerNotFoundException;
import pl.zawadzki.myplaces.model.Marker;
import pl.zawadzki.myplaces.service.MarkerService;

import java.util.List;

@RestController
@RequestMapping("/api/markers")
public class MarkerController {

    private final MarkerService markerService;

    public MarkerController(MarkerService markerService) {
        this.markerService = markerService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Marker>> getMarkers() {
        List<Marker> markerList = markerService.getUserMarkers();
        if(markerList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(markerList);
        }
        return ResponseEntity.status(HttpStatus.OK).body(markerList);
    }

    @GetMapping("/byCategory/{category}")
    public ResponseEntity<List<Marker>> getMarkersByCategory(@PathVariable String category) {
        List<Marker> markerList = markerService.getUserMarkersByCategory(category);
        if(markerList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(markerList);
        }
        return ResponseEntity.status(HttpStatus.OK).body(markerList);
    }

    @GetMapping("/getOne/{id}")
    public ResponseEntity<Marker> getMarker(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(markerService.getMarker(id));
    }

    @PostMapping("/new")
    public ResponseEntity saveMarker(@RequestBody Marker marker) {
        markerService.createNewMarker(marker);
        return ResponseEntity.status(HttpStatus.CREATED).header("Info", "Marker has been created!").build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteMarker(@PathVariable Long id) {
        markerService.deleteMarker(id);
        return ResponseEntity.status(HttpStatus.OK).header("Info", "Marker has been deleted!").build();
    }

    @ExceptionHandler(MarkerNotFoundException.class)
    public ResponseEntity markerExceptionHandler(MarkerNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).header("Info", ex.getMessage()).build();
    }

    @ExceptionHandler(DifferentUserMarkerException.class)
    public ResponseEntity markerExceptionHandler(DifferentUserMarkerException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).header("Info", ex.getMessage()).build();
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity markerExceptionHandler(CategoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).header("Info", ex.getMessage()).build();
    }


}
