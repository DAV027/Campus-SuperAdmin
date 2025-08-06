


# 🏫 Campus1 Super Admin Dashboard

A web-based administrative dashboard for managing users, work assignments, tracking systems, and notifications, built with **Spring Boot (Java)** and **vanilla HTML, CSS, and JavaScript**.


## 🚀 Features

- 🔐 Super Admin login and session management
- 👥 User Management: View, filter, assign, and import/export users
- 📄 Work Data: Tabbed view for All Users / Assigned Users
- 🔎 Filter by Source: LinkedIn, Naukri, Personal
- 📥 Upload/Download Excel for user records
- 📊 Work Assigned Module
- 📍 Tracking System integration
- 🔔 Real-time Notifications (coming soon)
- 📅 Timestamp Display (top-right clock with date)




## 🛠️ Tech Stack

| Layer          |  Technology                      |
|----------------|----------------------------------|
| Backend        | Spring Boot (Java 21)            |
| Frontend       | HTML, CSS, JavaScript            |
| View Engine    | JSP / Static HTML                |
| Database       | MySQL                            |
| File Upload    | Apache POI for Excel             |



## 📁 Project Structure (Backend)

```
src/
├── main/
│   ├── java/com/campus/dashboard/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── model/
│   └── resources/
│       ├── static/         # HTML, JS, CSS
│       ├── templates/      # JSP files (if used)
│       └── application.properties
└── pom.xml
```



## 📦 Setup Instructions

### ✅ Prerequisites

- Java 21+
- Maven 3+
- MySQL 8+
- Eclipse IDE with Spring Tools
- GitHub account (optional for version control)



### 🔧 Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/campus1-admin-dashboard.git
   cd campus1-admin-dashboard
   ```

2. **Configure MySQL**
   - Create a database (e.g., `superadmin`)
   - Update `application.properties`:
     ```
     spring.datasource.url=jdbc:mysql://localhost:3306/superadmin
     spring.datasource.username=root
     spring.datasource.password=your_password
     spring.mail.username=your_email_id
     spring.mail.password=your_app_password
     ```

3. **Run the app**
   - In Eclipse, right-click project → Run As → Spring Boot App
   - Or using terminal:
     ```bash
     mvn spring-boot:run
     ```

4. **Access the dashboard**
   ```
   http://localhost:8080/
   ```



## 📤 Upload Excel Format

> Supported file: `.xlsx` (Apache POI)

Required headers in Excel:
- ID
- Name
- Email
- Contact
- Source




## 🧩 Future Enhancements

- Real-time Notifications via WebSocket
- Role-based Dashboards (Manager, Student)
- Search autocomplete
- Audit logs and analytics reports
- Mobile responsiveness (Bootstrap or Tailwind)


