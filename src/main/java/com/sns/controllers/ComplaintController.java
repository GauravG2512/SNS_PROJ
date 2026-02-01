package com.sns.controllers;

import com.sns.models.Complaint;
import com.sns.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/lodge")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> lodgeComplaint(@RequestBody Complaint complaint) {
        Complaint saved = complaintService.submitComplaint(complaint);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('FIELD_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> resolveComplaint(
            @PathVariable Long id, 
            @RequestParam String proofUrl) {
        Complaint updated = complaintService.updateStatus(id, Complaint.Status.RESOLVED, proofUrl);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> confirmResolution(@PathVariable Long id) {
        Complaint updated = complaintService.updateStatus(id, Complaint.Status.CLOSED, null);
        return ResponseEntity.ok("Complaint successfully closed after citizen confirmation.");
    }
}