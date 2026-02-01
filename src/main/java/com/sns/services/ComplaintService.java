package com.sns.services;

import com.sns.models.Complaint;
import com.sns.models.Zone;
import com.sns.repositories.ComplaintRepository;
import com.sns.repositories.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private EmailService emailService;

    public Complaint submitComplaint(Complaint complaint) {
        // Logic for Geo-Routing
        Zone assignedZone = findZoneByCoordinates(complaint.getLatitude(), complaint.getLongitude());
        complaint.setZone(assignedZone);
        
        // Generate Unique ID SNS-YYYY-COUNT
        long count = complaintRepository.count() + 1;
        String complaintNumber = "SNS-2025-" + String.format("%03d", count);
        complaint.setComplaintNumber(complaintNumber);
        
        Complaint saved = complaintRepository.save(complaint);

        // Notify Citizen of successful submission
        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            emailService.sendStatusUpdateEmail(
                saved.getUser().getEmail(), 
                saved.getComplaintNumber(), 
                "SUBMITTED", 
                saved.getTitle()
            );
        }

        return saved;
    }

    private Zone findZoneByCoordinates(Double lat, Double lng) {
        List<Zone> zones = zoneRepository.findAll();
        return zones.isEmpty() ? null : zones.get(0); 
    }

    public Complaint updateStatus(Long id, Complaint.Status status, String resolutionProof) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(status);
        
        if (status == Complaint.Status.RESOLVED) {
            complaint.setResolutionProofImage(resolutionProof);
            complaint.setResolvedAt(LocalDateTime.now());
        }

        Complaint updated = complaintRepository.save(complaint);

        // Automated Notification on Status Change
        if (updated.getUser() != null && updated.getUser().getEmail() != null) {
            emailService.sendStatusUpdateEmail(
                updated.getUser().getEmail(),
                updated.getComplaintNumber(),
                status.name(),
                updated.getTitle()
            );
        }

        return updated;
    }
}