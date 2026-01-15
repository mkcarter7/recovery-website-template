# Recovery Website

Website for Recovery - a drug and alcohol recovery center.

## Tech Stack

- Django REST API (Backend)
- React (Frontend)
- Firebase Authentication

## Installation

### Prerequisites

- Python 3.11+
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv recoverytemp
   ```

3. Activate the virtual environment:
   - Windows (Git Bash):
     ```bash
     source recoverytemp/Scripts/activate
     ```
   - Windows (Command Prompt or PowerShell):
     ```bash
     recoverytemp\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source recoverytemp/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` and the backend API on `http://localhost:8000`.
