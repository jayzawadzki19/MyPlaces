package pl.zawadzki.myplaces.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.zawadzki.myplaces.enums.MarkerCategory;
import pl.zawadzki.myplaces.exception.CategoryNotFoundException;
import pl.zawadzki.myplaces.exception.DifferentUserMarkerException;
import pl.zawadzki.myplaces.exception.MarkerNotFoundException;
import pl.zawadzki.myplaces.model.Marker;
import pl.zawadzki.myplaces.model.User;
import pl.zawadzki.myplaces.repository.MarkerRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MarkerServiceTest {

    @Mock
    MarkerRepository repository;
    @Mock
    CurrentUserService currentUserService;

    @InjectMocks
    MarkerService service;

    @Test
    @DisplayName("Should find post by Id")
    void shouldFindMarkerById() {
        Marker marker = new Marker(1L, 23.123, 32.123, "TestMarker",
                "TestDesc", 1L, MarkerCategory.FOOD);

        when(repository.findById(1L)).thenReturn(Optional.of(marker));
        when(currentUserService.getCurrentUser())
                .thenReturn(new User(1L, "TestUser", "TestPassword", null, null));

        Marker response = service.getMarker(1L);

        assertThat(response.getMarkerId()).isEqualTo(marker.getMarkerId());
        assertThat(response.getTitle()).isEqualTo(marker.getTitle());
    }

    @Test
    @DisplayName("Should throw Exception when wanted marker does not exist")
    void shouldFailWhenMarkerDoesNotExist() {
        Long notExistingId = 3L;
        assertThatThrownBy(() -> service.getMarker(notExistingId))
                .isInstanceOf(MarkerNotFoundException.class).hasMessage("Marker with id: " + notExistingId + " does not exist!");
    }

    @Test
    @DisplayName("Should throw Exception when wanted marker belongs to different user")
    void shouldFailWhenMarkerBelongsToAnotherUser() {
        Marker marker = new Marker(1L, 23.123, 32.123, "TestMarker",
                "TestDesc", 1L, MarkerCategory.FOOD);

        when(repository.findById(1L)).thenReturn(Optional.of(marker));
        when(currentUserService.getCurrentUser())
                .thenReturn(new User(123L, "TestUser", "TestPassword", null, null));

        assertThrows(DifferentUserMarkerException.class, () -> service.getMarker(1L));
    }

    @Test
    @DisplayName("Should throw Exception when deleted marker does not exist")
    void shouldFailWhenDeletedMarkerDoesNotExist() {
        Long notExistingId = 3L;
        assertThatThrownBy(() -> service.deleteMarker(notExistingId))
                .isInstanceOf(MarkerNotFoundException.class).hasMessage("Marker with id: " + notExistingId + " does not exist!");
    }

    @Test
    @DisplayName("Should return user's markers list")
    void shouldReturnUserMarkersList() {
        List<Marker> markers = Arrays.asList(
                new Marker(1L, 23.123, 32.123, "TestMarkerOne",
                        "TestDescOne", 1L, MarkerCategory.FOOD),
                new Marker(1L, 23.123, 32.123, "TestMarkerTwo",
                        "TestDescTwo", 1L, MarkerCategory.FREETIME));

        User user = new User(1L, "TestUser", "TestPassword", null, Set.copyOf(markers));

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(repository.findAllByUserId(user.getUserId())).thenReturn(markers);

        List<Marker> responseList = service.getUserMarkers();

        assertThat(responseList).isEqualTo(markers);
    }

    @Test
    @DisplayName("Should return user's markers list by category")
    void shouldReturnUserMarkersListByCategory() {
        List<Marker> markers = Arrays.asList(
                new Marker(1L, 23.123, 32.123, "TestMarkerOne",
                        "TestDescOne", 1L, MarkerCategory.FOOD),
                new Marker(1L, 23.123, 32.123, "TestMarkerOne",
                        "TestDescTwo", 1L, MarkerCategory.FOOD),
                new Marker(1L, 23.123, 32.123, "TestMarkerTwo",
                        "TestDescThree", 1L, MarkerCategory.FREETIME));

        List<Marker> responseMarkers = Arrays.asList(
                new Marker(1L, 23.123, 32.123, "TestMarkerOne",
                        "TestDescOne", 1L, MarkerCategory.FOOD),
                new Marker(1L, 23.123, 32.123, "TestMarkerOne",
                        "TestDescTwo", 1L, MarkerCategory.FOOD));

        User user = new User(1L, "TestUser", "TestPassword", null, Set.copyOf(markers));

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(repository.findAllByUserIdAndCategory(user.getUserId(),MarkerCategory.FOOD))
                .thenReturn(responseMarkers);

        List<Marker> responseList = service.getUserMarkersByCategory("food");

        assertThat(responseList).isEqualTo(responseList);
    }

    @Test
    @DisplayName("Should throw Exception when given category does not exist")
    void shouldThrowExceptionWhenGivenCategoryDoesNotExist() {
        String category = "NotExistingCategory";
        assertThatThrownBy(() -> service.getUserMarkersByCategory(category))
                .isInstanceOf(CategoryNotFoundException.class).hasMessage("Category " + category + " does not exist!");
    }

}