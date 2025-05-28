const express = require('express');
const router = express.Router();
const { Student, Course, Grade } =  require('../model/schemas'); // Importez vos modèles

// Statistiques globales pour un étudiant
router.get('/stats/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // 1. Récupérer les informations de l'étudiant
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        // 2. Récupérer toutes les notes de l'étudiant
        const grades = await Grade.find({ student: studentId })
            .populate('course', 'name code')
            .sort({ date: 1 });

        // 3. Calculer la moyenne générale
        const average = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;

        // 4. Préparer les données de progression (par mois/semestre)
        const progression = calculateProgression(grades);

        // 5. Préparer les données pour les graphiques
        const chartData = {
            grades: grades.map(g => ({
                course: g.course.name,
                grade: g.grade,
                date: g.date
            })),
            progression
        };

        // 6. Calculer le positionnement (exemple simplifié)
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
                credits: calculateCredits(grades), // À implémenter selon votre logique
                position,
                nextCourse: await getNextCourse(studentId) // À implémenter
            },
            chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Fonctions utilitaires
function calculateProgression(grades) {
    // Grouper les notes par période (exemple simplifié)
    const progression = [];
    const periodSize = Math.ceil(grades.length / 6); // 6 périodes
    
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
    // Implémentez la logique pour récupérer le prochain cours
    // Par exemple, en fonction de l'emploi du temps
    return "Algorithmique - 15/05/2025";
}

function calculateCredits(grades) {
    // Implémentez la logique de calcul des crédits
    // Par exemple, compter les cours validés (note >= 10)
    const passedCourses = grades.filter(g => g.grade >= 50);
    return passedCourses.length * 5; // Exemple: 5 crédits par cours validé
}

module.exports = router;