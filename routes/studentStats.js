const express = require('express');
const router = express.Router();
const { Student, Course, Grade } =  require('../model/schemas'); 
router.get('/stats/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        const grades = await Grade.find({ student: studentId })
            .populate('course', 'name code')
            .sort({ date: 1 });

        const average = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;

        const progression = calculateProgression(grades);

        const chartData = {
            grades: grades.map(g => ({
                course: g.course.name,
                grade: g.grade,
                date: g.date
            })),
            progression
        };

        const allStudents = await Grade.aggregate([
            { $group: { _id: "$student", average: { $avg: "$grade" } } }
        ]);
        
        const sortedAverages = allStudents.map(s => s.average).sort((a, b) => b - a);
        const studentRank = sortedAverages.findIndex(avg => avg <= average) + 1;
        const position = calculatePosition(studentRank, sortedAverages.length);

        res.json({
            student: {
                name: `${student.firstName} ${student.lastName}`,
                id: student._id
            },
            stats: {
                overallAverage: average.toFixed(2),
                credits: calculateCredits(grades),
                position,
                nextCourse: await getNextCourse(studentId)
            },
            chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

function calculateProgression(grades) {
    const progression = [];
    const periodSize = Math.ceil(grades.length / 6); 
    
    for (let i = 0; i < 6; i++) {
        const periodGrades = grades.slice(i * periodSize, (i + 1) * periodSize);
        const periodAverage = periodGrades.reduce((sum, g) => sum + g.grade, 0) / periodGrades.length || 0;
        
        progression.push({
            period: `Sem. ${i + 1}`,
            average: periodAverage.toFixed(2)
        });
    }
    
    return progression;
}

function calculatePosition(rank, total) {
    const percentile = (rank / total) * 100;
    if (percentile <= 10) return 'Top 10%';
    if (percentile <= 25) return 'Top 25%';
    if (percentile <= 50) return 'Top 50%';
    return 'Top 100%';
}

async function getNextCourse(studentId) {

    return "Algorithmique - 15/05/2025";
}

function calculateCredits(grades) {
   
    const passedCourses = grades.filter(g => g.grade >= 50);
    return passedCourses.length * 5; 
}

module.exports = router;