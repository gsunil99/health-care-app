# Care for Health

**Care for Health** is a full-stack web application built using **React.js**, **Node.js**, and **MongoDB**. It brings **users and doctors** together on a single platform, managed by **admins (hospitals)**. The system handles **appointments, doctor management, payments, user and doctor profiles**, and more — all under one roof.

---

## 🔗 Live Demo

🌐 **Project Live**: [https://careforhealth.netlify.app/](https://careforhealth.netlify.app/)  

---

## 🔗 Demo Video
[CareForHealth-Intro.mp4](https://github.com/user-attachments/assets/f7303038-cf65-4e4a-bd15-057a09341f16)


---

## 📁 Project Structure

```
care-for-health/
│
├── admin/        # Admin dashboard (React.js)
├── frontend/     # User and doctor web interface (React.js)
├── backend/      # RESTful API and logic (Node.js + Express.js + MongoDB)
└── README.md     # You're here!
```

---

## ✨ Key Features

### 🧑‍⚕️ Users
- Secure registration and login via JWT
- Book and manage appointments
- View doctors and their specialties
- Access appointment and payment history
- Manage profile and basic health records

### 👨‍⚕️ Doctors
- Secure JWT login
- Manage availability and appointments
- View patient history
- Update profile and expertise

### 🏥 Admin (Hospital)
- Add/edit/remove doctors
- Manage all users and doctors
- View and control appointments and payments
- Dashboard for real-time monitoring

---

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: (Stripe/Razorpay or other as configured)

---

## 🔐 Authentication

- Authentication is implemented using **JWT (JSON Web Tokens)**.
- Tokens are generated on login and must be included in request headers for protected routes.

Example header:
```
Authorization: Bearer <your_token_here>
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed
- MongoDB (local or Atlas instance)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/health-care-app.git
cd health-care-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and add:

```env
MONGODB_URI = ''
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_SECRET_KEY = ''
ADMIN_EMAIL = ''
ADMIN_PASSWORD = ''
JWT_SECRET = ''
RAZOR_PAY_KEY_ID = ''
RAZOR_PAY_KEY_SECRET = ''
CURRENCY = ''
```

Start the server:
```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` and add:

```env
VITE_BACKEND_URL = ''
VITE_RAZOR_PAY_KEY_ID = ''
```

Start the server:
```bash
npm run dev
```
---

### 4. Admin Panel Setup

```bash
cd ../admin
npm install
```

Create a `.env` file inside `frontend/` and add:

```env
VITE_BACKEND_URL = ''
```

Start the server:
```bash
npm run dev
```

> Ensure `.env` files in both frontend and admin point to the backend API correctly.

---

## 📦 Folder Roles

| Folder     | Description                       |
|------------|-----------------------------------|
| `admin/`   | Admin dashboard for hospitals     |
| `frontend/`| User and doctor portal (React)    |
| `backend/` | API server with JWT auth (Node)   |

---

## 🔮 Future Enhancements

- Email/SMS notifications
- Video consultations
- Search and filtering for doctors
- Role-based access control
- Analytics dashboard

---

## 🤝 Contributing

We welcome contributions!

```bash
# Fork the repo
# Create your branch: git checkout -b feature/your-feature
# Commit changes: git commit -m "Add feature"
# Push: git push origin feature/your-feature
# Create Pull Request
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For issues, suggestions, or contributions, feel free to open an issue or contact: [gsunil99910@gmail.com]
