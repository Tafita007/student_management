let {Grade} = require('../model/schemas');

function getGradesByStudent(req, res) {
    const studentId = req.params.id;

    Grade.find({ student: studentId })
        .populate('course')
        .then((grades) => {
            res.send(grades);
        })
        .catch((err) => {
            res.status(500).send('Error getting grades: ' + err);
        });
}

function getCourseByStudent(req, res) {
    const studentId = req.params.id;

    Grade.find({ student: studentId })
        .populate('course')
        .then((grades) => {
            const coursesMap = new Map();

            grades.forEach((grade) => {
                if (grade.course) {
                    coursesMap.set(grade.course._id.toString(), grade.course);
                }
            });

            const uniqueCourses = Array.from(coursesMap.values());
            res.send(uniqueCourses);
        })
        .catch((err) => {
            res.status(500).send('Error getting courses: ' + err);
        });
}

module.exports = { getGradesByStudent, getCourseByStudent };
