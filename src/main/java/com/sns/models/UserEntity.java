
package com.sns.models;

import jakarta.persistence.*;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class UserEntity {
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phoneNumber;
}
