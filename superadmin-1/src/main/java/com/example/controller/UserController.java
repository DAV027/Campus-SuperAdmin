package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin // Allow CORS for frontend dev
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users (frontend expects flat structure)
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userService.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User user : users) {
            result.add(userToFlatMap(user));
        }
        return result;
    }

    // Add user
    @PostMapping
    public Map<String, Object> addUser(@RequestBody Map<String, Object> payload) {
        User user = flatMapToUser(payload);
        user = userService.save(user);
        return userToFlatMap(user);
    }

    // Update user
    @PutMapping("/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<User> opt = userService.findById(id);
        if (opt.isEmpty()) throw new RuntimeException("User not found");
        User user = flatMapToUser(payload);
        user.setId(id);
        user = userService.save(user);
        return userToFlatMap(user);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }

    // Upload users from Excel with source
    @PostMapping("/upload")
    public ResponseEntity<?> uploadUsersExcel(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "source", required = false) String source
    ) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("No file uploaded");

        try (InputStream is = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            List<User> usersList = new ArrayList<>();

            // Always log the received source parameter for each upload
            System.out.println("Received source parameter: " + source);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // skip header
                Row row = sheet.getRow(i);
                if (row == null) continue;

                User u = new User();
                u.setName(getCellString(row, 0));
                u.setEmail(getCellString(row, 1));
                u.setPhone(getCellString(row, 2));
                u.setDegree(getCellString(row, 3));
                u.setInstitution(getCellString(row, 4));
                u.setYear(getCellString(row, 5));
                // For lists, store as comma-separated strings
                u.setSkills(getCellString(row, 6));
                u.setPosition(getCellString(row, 7));
                u.setCompany(getCellString(row, 8));
                u.setDuration(getCellString(row, 9));
                u.setProjects(getCellString(row, 10));
                u.setCertifications(getCellString(row, 11));
                u.setAchievements(getCellString(row, 12));
                u.setLanguages(getCellString(row, 13));
                u.setHobbies(getCellString(row, 14));
                u.setReferenceName(getCellString(row, 15));
                u.setReferencePosition(getCellString(row, 16));
                u.setReferenceContact(getCellString(row, 17));

                // Always determine source per upload, not per session or static variable
                String excelSource = getCellString(row, 18);
                excelSource = excelSource != null ? excelSource.trim() : "";
                String paramSource = source != null ? source.trim() : "";

                String finalSource;
                if (!paramSource.isEmpty()) {
                    finalSource = paramSource;
                } else if (!excelSource.isEmpty()) {
                    finalSource = excelSource;
                } else {
                    finalSource = "Unknown";
                }
                u.setSource(finalSource);
                System.out.println("Setting source for row " + i + ": " + finalSource);

                usersList.add(u);
            }

            userService.saveAll(usersList);
            return ResponseEntity.ok("Users uploaded successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        }
    }

    // Download users as Excel
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadUsersExcel() throws IOException {
        List<User> usersList = userService.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Users");

        Row header = sheet.createRow(0);
        String[] headers = {
            "Name", "Email", "Phone", "Degree", "Institution", "Year",
            "Skills", "Position", "Company", "Duration", "Projects",
            "Certifications", "Achievements", "Languages", "Hobbies",
            "Reference Name", "Reference Position", "Reference Contact", "Source"
        };

        for (int i = 0; i < headers.length; i++) header.createCell(i).setCellValue(headers[i]);

        int rowIdx = 1;
        for (User u : usersList) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(u.getName());
            row.createCell(1).setCellValue(u.getEmail());
            row.createCell(2).setCellValue(u.getPhone());
            row.createCell(3).setCellValue(u.getDegree());
            row.createCell(4).setCellValue(u.getInstitution());
            row.createCell(5).setCellValue(u.getYear());
            row.createCell(6).setCellValue(u.getSkills() != null ? u.getSkills() : "");
            row.createCell(7).setCellValue(u.getPosition());
            row.createCell(8).setCellValue(u.getCompany());
            row.createCell(9).setCellValue(u.getDuration());
            row.createCell(10).setCellValue(u.getProjects() != null ? u.getProjects() : "");
            row.createCell(11).setCellValue(u.getCertifications() != null ? u.getCertifications() : "");
            row.createCell(12).setCellValue(u.getAchievements() != null ? u.getAchievements() : "");
            row.createCell(13).setCellValue(u.getLanguages() != null ? u.getLanguages() : "");
            row.createCell(14).setCellValue(u.getHobbies() != null ? u.getHobbies() : "");
            row.createCell(15).setCellValue(u.getReferenceName());
            row.createCell(16).setCellValue(u.getReferencePosition());
            row.createCell(17).setCellValue(u.getReferenceContact());
            row.createCell(18).setCellValue(u.getSource() != null ? u.getSource() : "");
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();
        byte[] excelBytes = bos.toByteArray();

        HttpHeaders headersExcel = new HttpHeaders();
        headersExcel.setContentDisposition(ContentDisposition.attachment().filename("users.xlsx").build());
        headersExcel.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        return new ResponseEntity<>(excelBytes, headersExcel, HttpStatus.OK);
    }

    private String getCellString(Row row, int idx) {
        Cell cell = row.getCell(idx);
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    // --- Helper methods to map between flat frontend structure and backend entity ---
    private Map<String, Object> userToFlatMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("degree", user.getDegree());
        map.put("institution", user.getInstitution());
        map.put("year", user.getYear());
        // Convert comma-separated strings to lists for frontend
        map.put("skills", splitStringToList(user.getSkills()));
        map.put("position", user.getPosition());
        map.put("company", user.getCompany());
        map.put("duration", user.getDuration());
        map.put("projects", splitStringToList(user.getProjects()));
        map.put("certifications", splitStringToList(user.getCertifications()));
        map.put("achievements", splitStringToList(user.getAchievements()));
        map.put("languages", splitStringToList(user.getLanguages()));
        map.put("hobbies", splitStringToList(user.getHobbies()));
        map.put("referenceName", user.getReferenceName());
        map.put("referencePosition", user.getReferencePosition());
        map.put("referenceContact", user.getReferenceContact());
        map.put("assignedTo", user.getAssignedTo());
        map.put("assignedToName", user.getAssignedToName());
        map.put("source", user.getSource());

        return map;
    }

    private User flatMapToUser(Map<String, Object> map) {
        User user = new User();
        user.setId(map.get("id") == null ? null : Long.valueOf(map.get("id").toString()));

        user.setName((String) map.get("name"));
        user.setEmail((String) map.get("email"));
        user.setPhone((String) map.get("phone"));
        user.setDegree((String) map.get("degree"));
        user.setInstitution((String) map.get("institution"));
        user.setYear((String) map.get("year"));

        // Convert lists to comma-separated strings for storage
        user.setSkills(joinListToString((List<String>) map.get("skills")));
        user.setPosition((String) map.get("position"));
        user.setCompany((String) map.get("company"));
        user.setDuration((String) map.get("duration"));
        user.setProjects(joinListToString((List<String>) map.get("projects")));
        user.setCertifications(joinListToString((List<String>) map.get("certifications")));
        user.setAchievements(joinListToString((List<String>) map.get("achievements")));
        user.setLanguages(joinListToString((List<String>) map.get("languages")));
        user.setHobbies(joinListToString((List<String>) map.get("hobbies")));

        user.setReferenceName((String) map.get("referenceName"));
        user.setReferencePosition((String) map.get("referencePosition"));
        user.setReferenceContact((String) map.get("referenceContact"));

        // Always use managerId for assignedTo
        Object assignedToObj = map.get("assignedTo");
        if (assignedToObj instanceof Number) {
            user.setAssignedTo(((Number) assignedToObj).intValue());
        } else if (assignedToObj != null) {
            try {
                user.setAssignedTo(Integer.parseInt(assignedToObj.toString()));
            } catch (Exception ignore) {}
        } else {
            user.setAssignedTo(null);
        }

        user.setAssignedToName((String) map.get("assignedToName"));
        user.setSource((String) map.get("source"));

        return user;
    }

    // Helper method to convert comma-separated string to list
    private List<String> splitStringToList(String str) {
        if (str == null || str.isEmpty()) return new ArrayList<>();
        return Arrays.asList(str.split("\\s*,\\s*"));
    }

    // Helper method to convert list to comma-separated string
    private String joinListToString(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return String.join(", ", list);
    }
}