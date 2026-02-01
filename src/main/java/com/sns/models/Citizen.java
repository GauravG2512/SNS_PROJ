package com.sns.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "citizens")
@Data
@EqualsAndHashCode(callSuper = true)
public class Citizen extends User {
    private String address;
    private Boolean accountLocked = false;
    private Integer failedAttempts = 0;

    public Citizen() {
        this.setRole(Role.ROLE_CITIZEN);
    }
}