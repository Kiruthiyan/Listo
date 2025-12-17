# 🎓 Listo - The Premium Student Task Manager

> **"Keep it simple, perfect, and premium."**

**Listo** is an enterprise-grade task management platform built for students who demand excellence. It combines a premium SaaS aesthetic with powerful productivity features to manage academic workloads efficiently.

---

## ✨ Key Features

### 🚀 **Productivity Core**
- **Smart Dashboard**: Personalized greeting with quick stats (Completed, Pending, Overdue).
- **Professional Task Views**:
    - **List View**: High-density table for scanning assignments (Linear-style).
    - **Board View**: Visual Grid layout for drag-and-drop workflows.
- **Advanced Filtering**: Filter by Status, Priority (Low/Medium/High), and Due Date.
- **Search**: Instant search across titles, descriptions, and subjects.


### 🎨 **Premium UI/UX**
- **Glassmorphism**: Modern, translucent UI elements.
- **Dark Mode**: Fully optimized dark/light themes.
- **Sliding Auth**: Unique "Sliding Panel" login/signup experience.
- **Responsive**: Mobile-first design with a bottom navigation bar.

---

## 🛠 Tech Stack

### **Frontend** (Port 3001)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Icons**: Lucide React
- **State**: React Hooks, Optimistic Updates

### **Backend** (Port 8081)
- **Core**: Java 21, Spring Boot 3
- **Security**: Spring Security + JWT (Stateless)
- **Database**: H2 In-Memory Database (Resets on restart - Dev Mode)
- **Build Tool**: Maven

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK 21+**
- **Node.js 18+**
- **Maven** (optional, wrapper included)

### 1. Backend Setup
The backend runs on `localhost:8081`.

```bash
cd backend
# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
# OR
java -jar target/api-0.0.1-SNAPSHOT.jar
```
*Note: The H2 database is in-memory. Data vanishes when the server stops.*

### 2. Frontend Setup
The frontend runs on `localhost:3001`.

```bash
cd frontend
# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/signup` | Create generic account |
| **POST** | `/auth/login` | Get JWT Token |
| **GET** | `/tasks` | Get all tasks for user |
| **POST** | `/tasks` | Create new task |
| **PUT** | `/tasks/{id}` | Update task |
| **POST** | `/tasks/{id}/subtasks` | Add subtask |
| **PUT** | `/subtasks/{id}` | Update subtask |

---

## 🔮 Roadmap
- [x] Authentication & JWT
- [x] Task CRUD & Search
- [x] Subtasks logic
- [x] Professional Views (List/Grid)
- [ ] Drag & Drop Kanban
- [ ] Calendar View
- [ ] User Profile Settings

---
*Built with ❤️ by Listo Team.*
