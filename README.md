# entrenamiento_salud
# 🏋️ Gym Tracker API

A REST API built with **Node.js**, **Express**, and **Mongoose** to manage users, workouts, personal records (PRs), and performance analysis in the gym.

---

## 🚀 Features

- CRUD for **users (persons)**.
- Record **personal bests** (Bench Press, Back Squat, Power Clean).
- Register **daily workouts** with detailed exercises.
- **Performance analysis** comparing workouts with the user’s PRs.
- Register **injuries** with date, severity, and observations.
- MongoDB connection using **Mongoose**.

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ademon04/entrenamiento_salud
cd entrenamiento_salud'

Install dependencies
Run the server

nmp start
Server will be available at:
http://localhost:3001
 API Endpoints
1️⃣ Health Check
GET /
Response: "Server is running successfully"

2️⃣ Create a new user
POST /personas
JSON Body:

json
Copiar
Editar
{
  "nombre": "John",
  "edad": 25,
  "genero": "masculino",
  "estadoFisico": "deportista",
  "objetivo": "fuerza"
}
3️⃣ Get all users
GET /personas

4️⃣ Get a user by ID
GET /personas/:postId

5️⃣ Add personal records to a user
POST /personas/:postId/marcas
JSON Body:

json
Copiar
Editar
{
  "benchPress": 100,
  "backSquat": 140,
  "powerClean": 90
}
6️⃣ Register a workout
POST /personas/:postId/entrenamientos
JSON Body:

json
Copiar
Editar
{
  "estadoEmocional": "motivated",
  "calidadSueno": "good",
  "nivelEnergia": 8,
  "ejercicios": [
    { "nombre": "benchPress", "peso": 80, "series": 4, "repeticiones": 10, "tipo": "fuerza" }
  ]
}
7️⃣ Analyze the performance of the latest workout
GET /personas/:postId/analisis
Sample Response:

json
Copiar
Editar
{
  "estadoEmocional": "motivated",
  "promedio": "85.33",
  "evaluacion": "good",
  "rendimiento": [
    { "nombre": "benchPress", "porcentaje": 80 },
    { "nombre": "backSquat", "porcentaje": 90 },
    { "nombre": "powerClean", "porcentaje": 86 }
  ]
}
8️⃣ Register an injury
POST /personas/:postId/lesiones
JSON Body:

json
Copiar
Editar
{
  "zona": "knee",
  "fecha": "2025-07-30",
  "gravedad": "moderate",
  "observaciones": "Discomfort during squats"
}
📂 Project Structure
bash
Copiar
Editar
├── app.js           # Main Express server
├── scheema.js       # Mongoose schema for Personas
├── package.json
├── .env
└── node_modules/
📄 License
MIT © 2025




