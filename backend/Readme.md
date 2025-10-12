cd backend && python -m uvicorn app.main:app --reload

backend/
│── app/
│   ├── main.py                # FastAPI entry point
│   ├── config.py              # Configs (DB URI, JWT secret, etc.)
│   ├── database.py            # MongoDB connection (Motor)
│   ├── auth/
│   │   ├── jwt_handler.py     # JWT create/verify
│   │   └── auth_routes.py     # Login/Register
│   ├── models/                # Pydantic models (above)
│   │   ├── common.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── experience.py
│   │   ├── technology.py
│   │   ├── certification.py
│   │   └── contact.py
│   ├── routes/                # CRUD routes
│   │   ├── user_routes.py
│   │   ├── project_routes.py
│   │   ├── experience_routes.py
│   │   ├── technology_routes.py
│   │   ├── certification_routes.py
│   │   └── contact_routes.py
│   └── utils/
│       └── security.py        # Password hashing (bcrypt)
│
├── requirements.txt           # FastAPI, motor, bcrypt, python-jose, etc.
└── .env                       # MONGODB_URI, JWT_SECRET, etc.
