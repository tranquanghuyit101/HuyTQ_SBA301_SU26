package com.lab05.orchidmanagement.controllers;

import com.lab05.orchidmanagement.pojos.Orchid;
import com.lab05.orchidmanagement.services.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orchids")
@CrossOrigin(origins = "http://localhost:5173")
public class OrchidController {

    private final IOrchidService orchidService;

    @Autowired
    public OrchidController(IOrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Orchid>> getAllOrchids() {
        List<Orchid> orchids = orchidService.getAllOrchids();
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Integer id) {
        return orchidService.getOrchidById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/")
    public ResponseEntity<Orchid> createOrchid(@RequestBody Orchid orchid) {
        Orchid created = orchidService.createOrchid(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(@PathVariable Integer id, @RequestBody Orchid orchid) {
        if (!orchidService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Orchid updated = orchidService.updateOrchid(id, orchid);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Integer id) {
        if (!orchidService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}
