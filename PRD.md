# Product Requirements Document (PRD)
## Zuddl Task - Team Task Management System

### 1. Product Overview
**Product Name:** Zuddl Task  
**Version:** 1.0  
**Owner:** Dinesh's Team  
**Purpose:** Centralized task management platform for team collaboration, progress tracking, and performance monitoring.

---

### 2. Core Objectives
- Enable seamless task creation, assignment, and tracking
- Provide real-time visibility into team workload and progress
- Facilitate accountability through detailed task reporting
- Streamline team collaboration with centralized task management

---

### 3. User Roles & Permissions

#### 3.1 Admin Role
- Full system access
- Create, edit, delete tasks
- Assign tasks to team members
- View all team tasks and dashboards
- Download performance reports
- Manage team members

#### 3.2 User Role (Future Enhancement)
- View assigned tasks only
- Update task status and progress
- Complete checklist items
- View personal dashboard

---

### 4. Key Features & Functionality

#### 4.1 Authentication System
- **Sign Up:** Email-based registration with admin invite code (123456)
- **Login:** Secure JWT-based authentication
- **Profile Management:** Update name, email, password, profile picture
- **Session Management:** Persistent login with 7-day token expiry

#### 4.2 Task Management
**Task Creation:**
- Title, description, priority (Low/Medium/High)
- Due date selection
- Multi-user assignment capability
- File attachments (documents, images)
- Customizable todo checklist

**Task Tracking:**
- Three status levels: Pending, In Progress, Completed
- Auto-progress calculation based on checklist completion
- Status filtering and search
- Task card view with key metrics

**Task Updates:**
- Edit task details (admin only)
- Update task status (assigned users)
- Mark checklist items complete/incomplete
- Add/remove attachments

**Task Deletion:**
- Admin-only task removal capability

#### 4.3 Dashboard & Analytics

**Admin Dashboard:**
- Total tasks count
- Pending tasks counter
- In-progress tasks tracker
- Completed tasks summary
- Overdue tasks alert
- Task distribution pie chart (by status)
- Priority level bar chart (Low/Medium/High)
- Recent 10 tasks timeline

**Personal Dashboard (User):**
- My assigned tasks statistics
- Personal progress charts
- My recent tasks list

#### 4.4 Team Management
- View all team members
- Display member profile with task statistics
- Track individual workload (pending/in-progress/completed)
- Download team performance report (Excel)

#### 4.5 Reporting System
**User Report:**
- Export all users with task counts
- Format: Excel (.xlsx)
- Fields: Name, Email, Role, Pending/In-Progress/Completed counts

**Task Report:**
- Export all tasks with full details
- Format: Excel (.xlsx)
- Fields: Title, Priority, Status, Due Date, Assigned Users, Progress

#### 4.6 File Management
- Image upload for profile pictures
- Task attachment support (multiple files)
- Static file serving from backend
- Cloudinary integration ready (future)

---

### 5. Technical Architecture

#### 5.1 Frontend Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Notifications:** React Hot Toast
- **Icons:** React Icons

#### 5.2 Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **File Upload:** Multer
- **CORS:** cors middleware
- **Environment:** dotenv

#### 5.3 Database Schema

**User Collection:**
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  profileImageUrl: String,
  role: String (admin/user),
  createdAt: Date,
  updatedAt: Date
}
```

**Task Collection:**
```
{
  _id: ObjectId,
  title: String,
  description: String,
  priority: String (Low/Medium/High),
  status: String (Pending/In Progress/Completed),
  dueDate: Date,
  assignedTo: [ObjectId] (User references),
  createdBy: ObjectId (User reference),
  attachments: [String] (file URLs),
  todoChecklist: [{
    text: String,
    completed: Boolean
  }],
  progress: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 6. API Endpoints

#### 6.1 Authentication Routes
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - User login
- `GET /api/auth/user-profile` - Get current user
- `PUT /api/auth/update-profile` - Update user details
- `POST /api/auth/upload-image` - Upload profile picture
- `POST /api/auth/sign-out` - Logout user

#### 6.2 User Routes
- `GET /api/users/get-users` - Get all users with task counts
- `GET /api/users/:id` - Get user by ID

#### 6.3 Task Routes
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id/checklist` - Update checklist
- `GET /api/tasks/dashboard-data` - Admin dashboard data
- `GET /api/tasks/user-dashboard-data` - User dashboard data

#### 6.4 Report Routes
- `GET /api/reports/export/users` - Download user report
- `GET /api/reports/export/tasks` - Download task report

---

### 7. User Interface Components

#### 7.1 Authentication Pages
- Login page with glassmorphism design
- Signup page with invite code validation
- Modern animated background
- Password visibility toggle
- Form validation

#### 7.2 Admin Pages
- Dashboard with charts and statistics
- Create/Edit Task form
- Manage Tasks (filterable task list)
- Team Members overview
- My Tasks view

#### 7.3 Reusable Components
- Navbar with user profile
- Sidebar navigation
- Task cards with progress indicators
- Avatar group for assigned users
- Status tabs (All/Pending/In Progress/Completed)
- Custom pie charts
- Custom bar charts
- Modal dialogs
- Delete confirmation alerts
- File upload input
- Profile photo selector

---

### 8. Environment Configuration

#### 8.1 Backend Environment Variables
```
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<Secret key for JWT>
ADMIN_JOIN_CODE=123456
FRONT_END_URL=<Frontend URL for CORS>
NODE_ENV=development/production
```

#### 8.2 Frontend Environment Variables
```
VITE_API_URL=<Backend API URL>
```

---

### 9. Deployment Architecture

#### 9.1 Frontend Deployment (Vercel)
- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `frontend`
- Environment: VITE_API_URL

#### 9.2 Backend Deployment (Render/Railway)
- Platform: Render.com or Railway.app
- Start Command: `npm start`
- Environment: All backend env variables
- Auto-deploy on Git push

#### 9.3 Database (MongoDB Atlas)
- Cloud-hosted MongoDB
- IP Whitelist: 0.0.0.0/0 (allow all)
- Database Name: zuddl-task
- Read/Write permissions enabled

---

### 10. Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- HttpOnly cookies for token storage
- CORS protection
- Environment variable security
- Input validation
- Role-based access control

---

### 11. Performance Optimizations
- Lazy loading of routes
- Optimized database queries with population
- Image compression for uploads
- Static file caching
- Frontend bundle optimization with Vite

---

### 12. Future Enhancements
- Real-time notifications (WebSockets)
- Task comments and discussions
- Email notifications for task assignments
- Calendar view for tasks
- Recurring tasks
- Task templates
- Advanced filtering and sorting
- Mobile app (React Native)
- Integration with Slack/Teams
- Time tracking for tasks
- Subtasks support
- Task dependencies
- Custom workflow stages
- Advanced analytics and insights

---

### 13. Success Metrics
- User adoption rate (% of team using system)
- Task completion rate
- Average task completion time
- Report download frequency
- Dashboard engagement
- System uptime (99.9% target)
- Page load time (<2 seconds)

---

**Document Version:** 1.0  
**Last Updated:** October 31, 2025  
**Status:** Active Development
