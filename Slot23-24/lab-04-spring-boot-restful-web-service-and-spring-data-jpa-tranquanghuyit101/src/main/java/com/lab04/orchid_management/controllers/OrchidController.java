package com.lab04.orchid_management.controllers;

import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.lab04.orchid_management.pojos.Orchid;
import com.lab04.orchid_management.services.IOrchidService;
import com.lab04.orchid_management.exception.OrchidNotFoundException;
import com.lab04.orchid_management.dto.ApiResponse;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final IOrchidService orchidService;

    // Inject IOrchidService via constructor
    public OrchidController(IOrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Orchid>>> getAllOrchids() {
        List<Orchid> orchids = orchidService.getAllOrchids();
        ApiResponse<List<Orchid>> response = new ApiResponse<>(true, "Orchids retrieved successfully", orchids);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> getOrchidById(@PathVariable Integer id) {
        Orchid orchid = orchidService.getOrchidById(id)
                .orElseThrow(() -> new OrchidNotFoundException("Orchid with ID " + id + " not found"));
        ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid retrieved successfully", orchid);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Orchid>> createOrchid(@Valid @RequestBody Orchid orchid) {
        Orchid createdOrchid = orchidService.createOrchid(orchid);
        ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid created successfully", createdOrchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> updateOrchid(@PathVariable Integer id, @Valid @RequestBody Orchid orchid) {
        Orchid updatedOrchid = orchidService.updateOrchid(id, orchid);
        if (updatedOrchid != null) {
            ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid updated successfully", updatedOrchid);
            return ResponseEntity.ok(response);
        } else {
            throw new OrchidNotFoundException("Orchid with ID " + id + " not found to update");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrchid(@PathVariable Integer id) {
        if (orchidService.deleteOrchid(id)) {
            return ResponseEntity.noContent().build();
        } else {
            throw new OrchidNotFoundException("Orchid with ID " + id + " not found to delete");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Orchid>>> searchOrchids(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isNatural
    ) {
        List<Orchid> searchResults = orchidService.searchOrchids(name, category, isNatural);
        ApiResponse<List<Orchid>> response = new ApiResponse<>(true, "Search completed successfully", searchResults);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<Orchid>>> getPagedOrchids(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "orchidId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Orchid> pagedOrchids = orchidService.getPagedOrchids(page, size, sortBy, direction);
        ApiResponse<Page<Orchid>> response = new ApiResponse<>(true, "Paged orchids retrieved successfully", pagedOrchids);
        return ResponseEntity.ok(response);
    }
}