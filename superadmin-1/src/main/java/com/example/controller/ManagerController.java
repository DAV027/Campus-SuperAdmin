package com.example.controller;

import com.example.model.Manager;
import com.example.service.ManagerService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.*;
@RestController
@RequestMapping("/api/managers")
@CrossOrigin
public class ManagerController {
    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    // DTO for frontend
    public static class ManagerDTO {
        public Long id;
        public String name;
        public String email;
        public String phone;
        public String role;
        public String password;
        public String confirmPassword;
        public Long assignedTo;
        
        // Default constructor for Jackson
        public ManagerDTO() {}
        
        public ManagerDTO(Manager m) {
            this.id = m.getId();
            this.name = m.getName();
            this.email = m.getEmail();
            this.phone = m.getPhone();
            this.role = m.getRole();
            this.password = m.getPassword();
            this.confirmPassword = m.getConfirmPassword();
            this.assignedTo = m.getAssignedTo() != null ? m.getAssignedTo().getId() : null;
        }
    }

    @GetMapping
    public List<ManagerDTO> getAllManagers() {
        List<Manager> managers = managerService.findAll();
        List<ManagerDTO> dtos = new ArrayList<>();
        for (Manager m : managers) {
            dtos.add(new ManagerDTO(m));
        }
        return dtos;
    }

    @PostMapping
    public ManagerDTO addManager(@RequestBody ManagerDTO dto) {
        Manager m = new Manager();
        m.setName(dto.name);
        m.setEmail(dto.email);
        m.setPhone(dto.phone);
        m.setRole(dto.role);
        m.setPassword(dto.password);
        m.setConfirmPassword(dto.confirmPassword);

        if (dto.assignedTo != null) {
            Manager assigned = managerService.findById(dto.assignedTo).orElse(null);
            m.setAssignedTo(assigned);
        }

        m = managerService.save(m);
        return new ManagerDTO(m);
    }

    @PutMapping("/{id}")
    public ManagerDTO updateManager(@PathVariable Long id, @RequestBody ManagerDTO dto) {
        Manager m = managerService.findById(id).orElseThrow();
        m.setName(dto.name);
        m.setEmail(dto.email);
        m.setPhone(dto.phone);
        m.setRole(dto.role);
        m.setPassword(dto.password);
        m.setConfirmPassword(dto.confirmPassword);

        if (dto.assignedTo != null) {
            Manager assigned = managerService.findById(dto.assignedTo).orElse(null);
            m.setAssignedTo(assigned);
        } else {
            m.setAssignedTo(null);
        }

        m = managerService.save(m);
        return new ManagerDTO(m);
    }

    @DeleteMapping("/{id}")
    public void deleteManager(@PathVariable Long id) {
        managerService.deleteById(id);
    }

    // Upload Excel and store managers
    @PostMapping("/upload")
    public ResponseEntity<?> uploadManagersExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("No file uploaded");
        
        try (InputStream is = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            List<Manager> managers = new ArrayList<>();
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // skip header
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Manager m = new Manager();
                m.setName(getCellString(row, 0));
                m.setEmail(getCellString(row, 1));
                m.setPhone(getCellString(row, 2));
                m.setRole(getCellString(row, 3));
                // assignedTo is not handled in Excel import for simplicity
                managers.add(m);
            }
            
            managerService.saveAll(managers);
            return ResponseEntity.ok("Managers uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file");
        }
    }

    // Download managers as Excel
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadManagersExcel() throws IOException {
        List<Manager> managers = managerService.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Managers");
        
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Name");
        header.createCell(1).setCellValue("Email");
        header.createCell(2).setCellValue("Phone");
        header.createCell(3).setCellValue("Role");
        
        int rowIdx = 1;
        for (Manager m : managers) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(m.getName());
            row.createCell(1).setCellValue(m.getEmail());
            row.createCell(2).setCellValue(m.getPhone());
            row.createCell(3).setCellValue(m.getRole());
        }
        
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();
        byte[] excelBytes = bos.toByteArray();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename("managers.xlsx").build());
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        
        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    // Get all admins
    @GetMapping("/admins")
    public List<ManagerDTO> getAllAdmins() {
        List<Manager> all = managerService.findAll();
        List<ManagerDTO> admins = new ArrayList<>();
        for (Manager m : all) {
            if ("Admin".equalsIgnoreCase(m.getRole())) {
                admins.add(new ManagerDTO(m));
            }
        }
        return admins;
    }

    // Assign admin to manager
    @PutMapping("/assign-admin/{adminId}")
    public Manager assignAdminToManager(@PathVariable Long adminId, @RequestParam Long managerId) {
        Manager admin = managerService.findById(adminId).orElseThrow();
        Manager manager = managerService.findById(managerId).orElseThrow();
        
        if (!"Admin".equalsIgnoreCase(admin.getRole()) || !"Manager".equalsIgnoreCase(manager.getRole())) {
            throw new IllegalArgumentException("Invalid roles for assignment");
        }
        
        admin.setAssignedTo(manager);
        return managerService.save(admin);
    }

    private String getCellString(Row row, int idx) {
        Cell cell = row.getCell(idx);
        return cell == null ? "" : cell.toString();
    }
}