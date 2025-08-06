package com.example.model;

import jakarta.persistence.*;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Personal Details
    private String name;
    private String email;
    private String phone;
    
    // Education
    private String degree;
    private String institution;
    private String year;
    
    // Skills (comma separated string)
    private String skills;
    
    // Work Experience
    private String position;
    private String company;
    private String duration;
    
    // Projects (comma separated string)
    private String projects;
    
    // Certifications (comma separated string)
    private String certifications;
    
    // Achievements (comma separated string)
    private String achievements;
    
    // Languages (comma separated string)
    private String languages;
    
    // Hobbies (comma separated string)
    private String hobbies;
    
    // References
    private String referenceName;
    private String referencePosition;
    private String referenceContact;
    
    // Assignment
    private Integer assignedTo;
    private String assignedToName;
    
    // Source
    private String source; // LinkedIn, Naukri, Personal, etc.
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
    public String getReferenceName() { return referenceName; }
    public void setReferenceName(String referenceName) { this.referenceName = referenceName; }
    public String getReferencePosition() { return referencePosition; }
    public void setReferencePosition(String referencePosition) { this.referencePosition = referencePosition; }
    public String getReferenceContact() { return referenceContact; }
    public void setReferenceContact(String referenceContact) { this.referenceContact = referenceContact; }
    public Integer getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Integer assignedTo) { this.assignedTo = assignedTo; }
    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}