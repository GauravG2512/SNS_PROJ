
package com.sns.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintId;

    @Column(unique = true, length = 50)
    private String complaintNumber; // Formatted like SNS-YYYYMMDD-XXXX

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    private LocalDateTime assignedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime slaDeadline;

    private String resolutionNotes;
    private String resolutionProofImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private Administrator assignedTo;

    public enum Status {
        SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, ESCALATED, REJECTED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}
