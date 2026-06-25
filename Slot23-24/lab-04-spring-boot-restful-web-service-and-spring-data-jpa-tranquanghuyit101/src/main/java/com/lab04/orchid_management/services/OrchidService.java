package com.lab04.orchid_management.services;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.lab04.orchid_management.pojos.Orchid;
import com.lab04.orchid_management.repositories.IOrchidRepository;

@Service
public class OrchidService implements IOrchidService {

    private final IOrchidRepository orchidRepository;

    public OrchidService(IOrchidRepository orchidRepository) {
        this.orchidRepository = orchidRepository;
    }

    @Override
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    @Override
    public Optional<Orchid> getOrchidById(Integer id) {
        return orchidRepository.findById(id);
    }

    @Override
    public Orchid createOrchid(Orchid orchid) {
        return orchidRepository.save(orchid);
    }

    @Override
    public Orchid updateOrchid(Integer id, Orchid orchid) {
        Optional<Orchid> optionalOrchid = orchidRepository.findById(id);
        if (optionalOrchid.isPresent()) {
            Orchid existingOrchid = optionalOrchid.get();
            existingOrchid.setOrchidName(orchid.getOrchidName());
            existingOrchid.setIsNatural(orchid.getIsNatural());
            existingOrchid.setOrchidDescription(orchid.getOrchidDescription());
            existingOrchid.setOrchidCategory(orchid.getOrchidCategory());
            existingOrchid.setIsAttractive(orchid.getIsAttractive());
            existingOrchid.setOrchidURL(orchid.getOrchidURL());
            return orchidRepository.save(existingOrchid);
        }
        return null;
    }

    @Override
    public boolean deleteOrchid(Integer id) {
        if (orchidRepository.existsById(id)) {
            orchidRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Orchid> searchOrchids(String name, String category, Boolean isNatural) {
        return orchidRepository.searchOrchids(name, category, isNatural);
    }

    @Override
    public Page<Orchid> getPagedOrchids(int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return orchidRepository.findAll(pageable);
    }
}