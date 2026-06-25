package com.lab04.orchid_management.services;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import com.lab04.orchid_management.pojos.Orchid;

public interface IOrchidService {
    List<Orchid> getAllOrchids();
    Optional<Orchid> getOrchidById(Integer id);
    Orchid createOrchid(Orchid orchid);
    Orchid updateOrchid(Integer id, Orchid orchid);
    boolean deleteOrchid(Integer id);
    List<Orchid> searchOrchids(String name, String category, Boolean isNatural);
    Page<Orchid> getPagedOrchids(int page, int size, String sortBy, String direction);
}