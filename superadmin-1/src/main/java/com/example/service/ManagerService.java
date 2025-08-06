package com.example.service;

import com.example.model.Manager;
import com.example.repository.ManagerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ManagerService {
    private final ManagerRepository managerRepository;

    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    public List<Manager> findAll() {
        return managerRepository.findAll();
    }

    public Optional<Manager> findById(Long id) {
        return managerRepository.findById(id);
    }

    public Manager save(Manager manager) {
        return managerRepository.save(manager);
    }

    public void saveAll(List<Manager> managers) {
        managerRepository.saveAll(managers);
    }

    public void deleteById(Long id) {
        managerRepository.deleteById(id);
    }
}
