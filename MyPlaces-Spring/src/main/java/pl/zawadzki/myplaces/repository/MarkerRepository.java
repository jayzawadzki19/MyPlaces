package pl.zawadzki.myplaces.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.zawadzki.myplaces.enums.MarkerCategory;
import pl.zawadzki.myplaces.model.Marker;

import java.util.List;

@Repository
public interface MarkerRepository extends JpaRepository<Marker,Long> {
    List<Marker> findAllByUserId(Long id);
    List<Marker> findAllByUserIdAndCategory(Long id, MarkerCategory category);
}
