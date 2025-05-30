require('dotenv').config();

// Imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Route handlers
const student = require('./routes/students');
const course = require('./routes/courses');
const grade = require('./routes/grades');
const authentification = require('./routes/authentification');
const studentDetails = require('./routes/studentDetails');
const studentStatsRouter = require('./routes/studentStats');
const adminStatsRouter = require('./routes/adminStats');
const renderRoutesPage = require('./routes/indexRoute');

// App initialization
const app = express();
const PORT = process.env.PORT || 8010;
const prefix = '/api';

// Database connection
mongoose.Promise = global.Promise;
const uri = process.env.MONGO_DB_URL;
const options = {};

mongoose.connect(uri, options)
  .then(() => {
    mongoose.set('debug', true);
    const dbName = mongoose.connection.name;
    console.log("Connexion à la base OK :", dbName);
  })
  .catch(err => {
    console.log('Erreur de connexion: ', err);
  });

// Middlewares
const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send(renderRoutesPage(app, process.env.CLIENT_URL));
});

app.route(`${prefix}/students`)
  .get(student.getAll)
  .post(student.create);

app.route(`${prefix}/students/:id`)
  .get(student.getById)
  .put(student.update)
  .delete(student.deleteStudent);

app.route(`${prefix}/courses`)
  .get(course.getAll)
  .post(course.create);

app.route(`${prefix}/courses/:id`)
  .put(course.update)
  .delete(course.deleteCourse);

app.route(`${prefix}/grades`)
  .get(grade.getAll)
  .post(grade.create);

app.route(`${prefix}/grades/:id`)
  .put(grade.update)
  .delete(grade.deleteGrade);

app.route(`${prefix}/auth`)
  .post(authentification.insertProfil);

app.route(`${prefix}/authGmail`)
  .post(authentification.insertProfilGmail);

app.route(`${prefix}/auth/login`)
  .post(authentification.loginUser);

app.route(`${prefix}/changepassword`)
  .post(authentification.changePassword);

app.route(`${prefix}/users`)
  .get(authentification.getAll);

app.route(`${prefix}/student-grades/:id`)
  .get(studentDetails.getGradesByStudent);

app.route(`${prefix}/student-courses/:id`)
  .get(studentDetails.getCourseByStudent);

app.use(`${prefix}/studentstats`, studentStatsRouter);
app.use(`${prefix}/adminstats`, adminStatsRouter);

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

module.exports = app;
