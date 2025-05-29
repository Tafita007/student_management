require('dotenv').config();
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');
let authentification = require('./routes/authentification');
let studentStatsRouter = require('./routes/studentStats');
const adminStatsRouter = require('./routes/adminStats');

let studentDetails = require('./routes/studentDetails');
let app = express();

mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

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

// Pour accepter les connexions cross-domain (CORS)
// app.use(function (req, res, next) {
//   const allowedOrigin = process.env.CLIENT_URL || '*';
//   res.header("Access-Control-Allow-Origin", allowedOrigin);
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204);
//   }

//   next();
// });

const cors = require('cors');

const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let PORT = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/students')
    .get(student.getAll)
    .post(student.create);
app.route(prefix + '/students/:id')
    .get(student.getById)
    .put(student.update)
    .delete(student.deleteStudent);

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);
app.route(prefix + '/courses/:id')
    .put(course.update)
    .delete(course.deleteCourse);

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);
app.route(prefix + '/grades/:id')
    .put(grade.update)
    .delete(grade.deleteGrade);

app.route(prefix + '/auth')
    .post(authentification.insertProfil);

    app.route(prefix + '/authGmail')
    .post(authentification.insertProfilGmail);

app.route(prefix + '/auth/login')
    .post(authentification.loginUser);

app.route(prefix + '/changepassword')
    .post(authentification.changePassword);

app.use(prefix +'/studentstats', studentStatsRouter);
app.use(prefix +'/adminstats', adminStatsRouter);

app.route(prefix + '/users')
    .get(authentification.getAll);

app.route(prefix + '/student-grades/:id')
    .get(studentDetails.getGradesByStudent);

app.route(prefix + '/student-courses/:id')
    .get(studentDetails.getCourseByStudent);

// On démarre le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

module.exports = app;
