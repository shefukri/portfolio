# Portfolio Website

A modern, responsive personal portfolio website built with the PERN stack (simulated with SQLite for development ease).

## 🚀 Features

- **Modern UI**: Split-screen design with a "Hero" identity section and scrollable content.
- **Dynamic Content**: Data (About, Projects, Experience, Skills) is fetched from a backend API.
- **Interactive**:
  - Sliding Sidebar navigation with active state indication.
  - Smooth scroll animations using Framer Motion.
  - Functional Contact Form (sends emails via Nodemailer).
- **Responsive**: Fully optimized for mobile and desktop screens.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, CSS Variables.
- **Backend**: Node.js, Express.
- **Database**: SQLite (easy setup, no external server required).

## 📂 Project Structure

```
Portfolio/
├── client/         # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   └── App.jsx      # Main Logic
│   └── public/          # Static Assets (Images, Resume)
└── server/         # Node.js Backend
    ├── server.js   # API & Email Logic
    ├── seed.js     # Database Seeding Script
    ├── database.sqlite # Local Database
    └── .env        # Environment Variables (Email Credentials)
```

## ⚡ Getting Started

### Prerequisites

- Node.js installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd Portfolio
    ```

2.  **Setup Backend**:
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in `server/` with:
        ```env
        PORT=3000
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASS=your_app_password
        ```

3.  **Setup Frontend**:
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

You need to run both client and server terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm start
```
*Server runs on http://localhost:3000*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Client runs on http://localhost:5173*

## 📝 Usage

- Update `seed.js` in `server/` to change the portfolio content.
- Run `node seed.js` (inside `server/`) to reset the database with new data.
- Replace images in `client/public/` (`profile_photo.jpeg`, `project1.png`, etc.) with your own.

## 📄 License

MIT
