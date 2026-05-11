# Vijay Guest House (VGH) - Hotel Management System

A premium, full-stack Hotel Management System (HMS) designed for **Vijay Guest House**. This application provides a robust suite of tools for managing room occupancy, customer check-ins, financial settlements, and expense tracking with a polished, modern user interface.

## 🚀 Features

### 🏨 Room & Customer Management
- **Live Occupancy Dashboard**: Real-time status of available and occupied rooms.
- **Efficient Check-in/Check-out**: Streamlined forms for customer data entry and room assignment.
- **Customer Directory**: Searchable database of all current and past customers.

### 💰 Financial Management
- **Pending Payments**: Automated tracking of outstanding balances.
- **Professional Settlements**: Clean UI for settling payments and generating records.
- **Revenue Tracking**: Real-time insights into total revenue and daily collections.

### 📉 Expense & Report Management
- **Monthly Expense Tracking**: Categorize and filter expenses by month and year.
- **PDF Report Generation**: Export professional financial reports for both expenses and revenue.
- **Data Visualization**: Interactive charts for occupancy and financial trends.

### 📱 Progressive Web App (PWA)
- **Installable**: Can be installed directly from Google Chrome as a standalone application.
- **Offline Ready**: Basic service worker integration for improved reliability.

### 🛠️ Developer Marketing Integration
- **Sidebar Branding**: Integrated developer credits and copyright information.
- **Contact Modal**: Premium popup showcasing developer services (AI/ML, Web Dev, System Design, etc.) for marketing purposes.

---

## 🛠️ Technology Stack

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **ORM**: SQLAlchemy
- **Database**: MySQL (via `pymysql`)
- **Authentication**: JWT (python-jose) & Bcrypt (passlib)
- **Task Automation**: Alembic for migrations.

### **Frontend**
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **UI/Charts**: Recharts
- **PDF Export**: jsPDF & html2canvas
- **Styling**: Vanilla CSS with modern "SaaS" aesthetics.

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Python 3.10+
- Node.js 18+
- MySQL Server

### **1. Backend Setup**
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment (Windows)
venv\Scripts\activate
# Install dependencies
pip install -r ../requirements.txt
# Run the server
uvicorn app.main:app --reload
```

### **2. Frontend Setup**
```bash
cd frontend/frontend
# Install packages
npm install
# Start development server
npm run dev
```

### **3. Environment Variables**
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost/vgh_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
```

---

## 📁 Project Structure

```text
VGH/
├── backend/                # FastAPI Application
│   ├── app/                # Core logic (routers, models, schemas)
│   ├── alembic/            # Database migrations
│   └── uploads/            # Customer document storage
├── frontend/               # React Application
│   └── frontend/
│       ├── src/
│       │   ├── components/ # Reusable UI components
│       │   ├── pages/      # Page-level components
│       │   └── store/      # Redux state logic
├── .gitignore              # Standard ignore rules for Python & JS
├── requirements.txt        # Python dependencies
└── README.md               # You are here!
```

---

## 👨‍💻 Developer
Developed with ❤️ by **Divyansh Rajput**.
- **Portfolio**: [divyansh-portfolio126.netlify.app](https://divyansh-portfolio126.netlify.app/)
- **Contact**: divyanshrajput126@gmail.com | +91 9023848410

---
© 2026 Vijay Guest House. All Rights Reserved.
