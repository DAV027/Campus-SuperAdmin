package com.example.model;


import jakarta.persistence.*;

@Entity
@Table(name = "managers")
public class Manager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String role; // "Manager" or "Admin"

    private String password;
    private String confirmPassword;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private Manager assignedTo; // Only for Admins, null for Managers

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public Manager getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Manager assignedTo) { this.assignedTo = assignedTo; }
}
