const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_super_secret_key_123";

const app = express();

// 1. ПЕРЕВІРКА КЛЮЧА FIREBASE
try {
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin ініціалізовано");
} catch (error) {
  console.error("Помилка ініціалізації Firebase:", error);
  process.exit(1);
}

const db = admin.firestore();

// 2. КОНФІГУРАЦІЯ SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Tracker API',
      version: '1.0.0',
      description: 'API Documentation for Lab 5 (З авторизацією)',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Вставте ваш JWT токен сюди (слово Bearer додавати не потрібно)'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());

// --- МАРШРУТИ API ---

/**
 * @openapi
 * /api/workouts:
 *   get:
 *     summary: Отримання тренувань з групуванням за типами
 *     responses:
 *       200:
 *         description: Об'єкт із згрупованими тренуваннями
 *   post:
 *     summary: Збереження нового тренування
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ранкова йога"
 *               type:
 *                 type: string
 *                 example: "Йога"
 *               calories:
 *                 type: number
 *                 example: 150
 *               desc:
 *                 type: string
 *                 example: "Легка розтяжка для початку дня"
 *               level:
 *                 type: string
 *                 example: "Початківець"
 *               time:
 *                 type: number
 *                 example: 20
 *               video:
 *                 type: string
 *                 example: "JlshQl_-gp4"
 *     responses:
 *       201:
 *         description: Успішно створено
 *       400:
 *         description: Дані порожні
 */
app.get("/api/workouts", async (req, res) => {
  try {
    const snapshot = await db.collection("history").get();
    const workouts = [];
    snapshot.forEach(doc => {
      workouts.push({ id: doc.id, ...doc.data() });
    });

    const groupedWorkouts = workouts.reduce((acc, workout) => {
      const wType = workout.type || "Інше";
      if (!acc[wType]) acc[wType] = [];
      acc[wType].push(workout);
      return acc;
    }, {});

    res.json(groupedWorkouts);
  } catch (error) {
    res.status(500).json({ error: "Помилка при групуванні даних" });
  }
});

app.post("/api/workouts", async (req, res) => {
  try {
    const newWorkout = req.body;
    if (!newWorkout || Object.keys(newWorkout).length === 0) {
      return res.status(400).json({ error: "Дані порожні" });
    }
    const docRef = await db.collection("history").add(newWorkout);
    res.status(201).json({ id: docRef.id, message: "Тренування успішно додано!" });
  } catch (error) {
    console.error("Помилка POST:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /api/history:
 *   get:
 *     summary: Отримання повної історії тренувань
 *     responses:
 *       200:
 *         description: Масив усіх тренувань
 */
app.get("/api/history", async (req, res) => {
  try {
    const snapshot = await db.collection("history").get();
    const historyData = [];
    snapshot.forEach(doc => {
      historyData.push({ id: doc.id, ...doc.data() });
    });
    res.json(historyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /api/progress:
 *   get:
 *     summary: Отримання даних прогресу
 *     responses:
 *       200:
 *         description: Кроки та вага
 *   post:
 *     summary: Збереження показників прогресу
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - steps
 *             properties:
 *               userId:
 *                 type: string
 *               steps:
 *                 type: number
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Прогрес додано
 *       400:
 *         description: Неповні дані для прогресу
 */
app.get("/api/progress", async (req, res) => {
  try {
    const snapshot = await db.collection("progress").get();
    const progressData = [];
    snapshot.forEach(doc => {
      progressData.push({ id: doc.id, ...doc.data() });
    });
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/progress", async (req, res) => {
  try {
    const newRecord = req.body;
    if (!newRecord.userId || !newRecord.steps) {
      return res.status(400).json({ error: "Неповні дані для прогресу" });
    }
    const docRef = await db.collection("progress").add(newRecord);
    res.status(201).json({ id: docRef.id, message: "Прогрес успішно додано!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// АВТЕНТИФІКАЦІЯ
// ==========================================

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Користувача створено
 *       400:
 *         description: Введіть email та пароль
 */
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Введіть email та пароль" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRef = await db.collection("users").add({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Користувача успішно зареєстровано", userId: userRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Вхід користувача (отримання JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успішний вхід, повертає токен
 *       400:
 *         description: Користувача не знайдено або неправильний пароль
 */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersSnapshot = await db.collection("users").where("email", "==", email).get();
    if (usersSnapshot.empty) return res.status(400).json({ error: "Користувача не знайдено" });

    const userDoc = usersSnapshot.docs[0];
    const user = userDoc.data();

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Неправильний пароль" });

    const token = jwt.sign({ userId: userDoc.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Успішний вхід", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware для захисту маршрутів
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Доступ заборонено, немає токена" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Недійсний токен" });
  }
};

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Отримання профілю (Захищений маршрут)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані профілю
 *       401:
 *         description: Доступ заборонено
 */
app.get("/profile", verifyToken, async (req, res) => {
  res.json({
    message: "Це захищені дані профілю",
    user: req.user
  });
});

// ЗАПУСК СЕРВЕРА
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Сервер працює на: http://localhost:${PORT}`);
  console.log(`Swagger доступний: http://localhost:5000/api-docs`);
  console.log(`=========================================`);
});