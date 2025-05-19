package com.sismics.docs.core.model.jpa;

import com.google.common.base.MoreObjects;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "T_USER_REQUEST")
public class UserRequest {
    @Id
    @Column(name = "REQ_ID", length = 36)
    private String id;

    @Column(name = "REQ_USERNAME", nullable = false, length = 50)
    private String username;

    @Column(name = "REQ_EMAIL", length = 100)
    private String email;

    @Column(name = "REQ_STATUS", nullable = false)
    private String status; // PENDING/APPROVED/REJECTED

    @Column(name = "REQ_CREATEDATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createDate;
    // getters & setters
}