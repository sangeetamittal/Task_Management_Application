# 📌 Task Management Backend System

A collaborative task management backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.io**, featuring secure JWT-based authentication, role-based access control, real-time updates, and RESTful APIs easily consumable by a React frontend.

---

## 📖 Project Overview

This backend system allows **Managers** to assign tasks and **Employees** to track and update them in real time. It includes:

- Secure **user authentication**
- **Manager/Employee roles** with different access levels
- Full **task CRUD operations**
- **Real-time updates** using Socket.io
- Ready-to-integrate **RESTful APIs** for a React frontend

> **Assumptions**:
> - Only Managers can create/update/delete tasks
> - Employees can view tasks assigned to them and update only their task's status
> - Real-time communication is based on Socket.io registration using userId

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Task_Management_Application.git
cd Task_Management_Application/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `/backend` folder based on `.env.example`:

```env
MONGO_URL=your_mongodb_atlas_url
JWT_SECRET=your_secure_jwt_secret
```

**Note:** Do not commit `.env` to version control.

### 4. Run the Server

```bash
nodemon server.js
```

Server runs at:  
`http://localhost:5000`

---

## 🔐 Authentication

- **JWT** tokens are issued at login and required in the `Authorization` header for protected routes.
- Example header:
  ```
  Authorization: Bearer <your_token>
  ```

---

## 📬 API Endpoints

### 👥 Auth Routes

| Endpoint            | Method | Access   | Description             |
|---------------------|--------|----------|-------------------------|
| `/api/auth/register` | POST   | Public   | Register user (Manager/Employee) |
| `/api/auth/login`    | POST   | Public   | Login and get JWT token |

---

### ✅ Task Routes

| Endpoint           | Method | Access     | Description                     |
|--------------------|--------|------------|---------------------------------|
| `/api/tasks`       | POST   | Manager    | Create new task                |
| `/api/tasks`       | GET    | Manager/Employee | Get all relevant tasks         |
| `/api/tasks/:id`   | PUT    | Manager/Employee | Update task (status or full)   |
| `/api/tasks/:id`   | DELETE | Manager    | Delete task                    |

---

### 👤 User Routes (Extra Endpoint)

| Endpoint         | Method | Access   | Description                          |
|------------------|--------|----------|--------------------------------------|
| `/api/users`     | GET    | Manager  | Get all users (optionally filter by role) |

Example:  
```
GET /api/users?role=Employee
```

---

## 📝 Sample Task Object

```json
{
  "title": "Build dashboard UI",
  "description": "Create layout in React",
  "assignedTo": "<employee_user_id>",
  "status": "Pending",
  "dueDate": "2025-06-15"
}
```

---

## 📤 Sample API Responses

### ✅ Register User

**POST /api/auth/register**

```json
{
  "message": "User registered successfully"
}
```

---

### ✅ Login

**POST /api/auth/login**

```json
{
  "message": "Login Successful!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "John",
    "role": "Manager"
  }
}
```

---

### ✅ Get Tasks

**GET /api/tasks**

```json
[
  {
    "_id": "task_id",
    "title": "Implement Login UI",
    "description": "Design the login form in React",
    "assignedTo": {
      "_id": "employee_id",
      "username": "Deepak",
      "email": "deepak@example.com",
      "role": "Employee"
    },
    "status": "Pending",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "createdBy": "manager_id",
    "createdAt": "2025-06-07T05:31:20.807Z",
    "updatedAt": "2025-06-07T05:31:20.807Z",
    "__v": 0
  }
]
```

---

### ✅ Post Tasks

**POST /api/tasks**

```json
{
  "message": "Task created",
  "Task": {
    "title": "Task For Emily",
    "assignedTo": "employee_id",
    "status": "Pending",
    "dueDate": "2025-06-20T00:00:00.000Z",
    "createdBy": "manager_id",
    "_id": "task_id",
    "createdAt": "2025-06-07T12:14:45.393Z",
    "updatedAt": "2025-06-07T12:14:45.393Z",
    "__v": 0
  }
}
```

---

### ✅ Delete Tasks

**DELETE /api/tasks/:id**

```json
{
  "message": "Task deleted successfully"
}
```

---

### ✅ Update Tasks

**Update /api/tasks/:id**

```json
{
  "message": "Task updated",
  "task": {
    "_id": "task_id",
    "title": "Implement Login UI",
    "description": "Design the login form in React",
    "assignedTo": "employee_id",
    "status": "Completed",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "createdBy": "manager_id",
    "createdAt": "2025-06-07T05:31:20.807Z",
    "updatedAt": "2025-06-07T14:05:13.645Z",
    "__v": 0
  }
}
```

### ✅ Get all users Task

**GET /api/users**

```json
{
  "users": [
    {
      "_id": "user_id",
      "username": "Sangeeta",
      "email": "sangeeta@example.com",
      "role": "Manager",
      "createdAt": "2025-06-06T18:23:17.157Z",
      "updatedAt": "2025-06-06T18:23:17.157Z",
      "__v": 0
    }
  ]
}
```

---

## 🔔 Socket.IO Events

| Event           | Trigger                     | Sent To               | Payload                 |
|------------------|------------------------------|------------------------|--------------------------|
| `register`       | On user login (frontend)     | Backend                | `userId`                 |
| `task-assigned`  | When Manager creates a task  | Assigned Employee      | `task` object            |
| `task-updated`   | When task is updated         | Task creator/assignee  | Updated `task` object    |

Example (frontend):

```js
socket.emit('register', userId);
socket.on('task-assigned', (task) => console.log(task));
socket.on('task-updated', (task) => console.log(task));
```

---

## 🧪 Bonus Features (Coming Soon)

- [ ] Unit Testing (Jest / Supertest)
- [ ] React Frontend
- [ ] Deployment to Render/Railway/Vercel

---

## 📁 Folder Structure

```
/backend
├── handlers/          # Auth & task logic
├── middleware/        # JWT and role protection
├── models/            # Mongoose schemas
├── routes/            # Express route definitions
├── sockets/           # Socket.io event logic
├── .env.example       # Sample env config
├── server.js          # Entry point
```

---

## ✅ Features Implemented

- [x] JWT-based user authentication
- [x] Role-based route access
- [x] Manager can create, update, delete tasks
- [x] Employee can only update their assigned task’s status
- [x] Real-time task notifications
- [x] Data validation using `express-validator`
- [x] Secure password hashing using `bcryptjs`

---

## Contact

Made by [Sangeeta Mittal](https://github.com/sangeetamittal)