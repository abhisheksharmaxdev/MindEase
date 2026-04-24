# MindEase 🧠

MindEase is a full-stack mental wellness platform built for college students, combining therapist support, admin management, and an AI-powered assistant (MindMate).

---

## Project Structure

The project is divided into two main parts:

* **backend/** – Node.js + Express API

  * Handles authentication, booking, therapist/admin features, and MindMate AI integration
* **frontend/** – Angular application

  * Provides UI for users, dashboards, booking system, and MindMate chat interface

---

##  Features

* User Signup & Login with profile management
* Anonymous concern reporting system
* Admin dashboard for managing and assigning concerns
* Therapist dashboard with accept/reject functionality
* Booking system with session management
* Transaction history tracking
* AI chatbot (MindMate) for emotional support
* Real-time dashboard updates using polling

---

##  Tech Stack

* **Frontend:** Angular
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **AI Integration:** OpenAI API

---

##  MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Add your IP address in *Network Access*
4. Copy your connection string (`mongodb+srv://...`)
5. Copy `.env.example` to `.env` and update the values:

```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

---

##  Installation & Running the Project

Install dependencies:

```
npm install
npm --prefix backend install
npm --prefix frontend install
```

Run the project:

```
npm run dev
```

---

##  Local Development URLs

* Frontend: http://localhost:4200
* Backend: http://localhost:5000

---

## Data Migration (Optional)

If you have local MongoDB data:

1. Set in `backend/.env`:

```
TARGET_MONGODB_URI=your_atlas_uri
```

2. Run:

```
npm --prefix backend run migrate:atlas
```

---

##  Default Credentials
These are demo credentials for testing purposes only.

### Admin

* Email: [admin@mindease.com](mailto:admin@mindease.com)
* Password: Admin@123

### Therapists

* Niharika Singh → [niharika@mindease.com](mailto:niharika@mindease.com) / Therapist@123
* Arjun Sharma → [arjun@mindease.com](mailto:arjun@mindease.com) / Therapist@123
* Priya Chauhan → [priya@mindease.com](mailto:priya@mindease.com) / Therapist@123

---

##  MindMate (AI Chat)

MindMate is an AI-based chatbot integrated using OpenAI API.
It provides:

* Emotional support conversations
* Hinglish/English adaptive responses
* Context-aware replies
* Safe fallback handling

## Screenshots

(images of dashboard, chatbot, booking system here)

## Live Demo

Frontend: https://your-link  
Backend: https://your-api-link
---

##  Notes

* Copy `.env.example` to `.env` inside the backend folder and configure the required values.
* Ensure `.env` file is configured before running the project
* Do not share API keys publicly
* MongoDB Atlas is required for database functionality

---

## Author

Developed as a full-stack AI-based project for academic purposes.
