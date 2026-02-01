package com.sns.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        ROLE_CITIZEN, ROLE_FIELD_OFFICER, ROLE_ADMIN
    }
}