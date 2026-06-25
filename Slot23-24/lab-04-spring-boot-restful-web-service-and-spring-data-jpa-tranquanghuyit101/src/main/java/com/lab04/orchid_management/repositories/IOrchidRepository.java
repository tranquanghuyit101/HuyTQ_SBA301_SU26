package com.lab04.orchid_management.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.lab04.orchid_management.pojos.Orchid;

@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Integer> {
    
    List<Orchid> findByOrchidCategory(String orchidCategory);
    
    List<Orchid> findByOrchidNameContainingIgnoreCase(String orchidName);
    
    List<Orchid> findByIsNatural(Boolean isNatural);
    
    List<Orchid> findByIsAttractive(Boolean isAttractive);

    @Query("SELECT o FROM Orchid o WHERE " +
           "(:name IS NULL OR LOWER(o.orchidName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR o.orchidCategory = :category) AND " +
           "(:isNatural IS NULL OR o.isNatural = :isNatural)")
    List<Orchid> searchOrchids(
        @Param("name") String name,
        @Param("category") String category,
        @Param("isNatural") Boolean isNatural
    );
}
