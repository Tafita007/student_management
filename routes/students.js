let {Student} = require('../model/schemas');

function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let student = new Student();
    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;

    student.save()
        .then((student) => {
                res.json({message: `student saved with id ${student.id}!`});
            }
        ).catch((err) => {
        res.send('cant post student ', err);
    });
}

function update(req, res) {
    //const { studentId } = req.params; 
    const { id } = req.params; 
    const { firstName, lastName } = req.body;

    Student.findByIdAndUpdate(id, { firstName, lastName }, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send('Student not found!');
            }
            res.json({ message: `Student updated with id ${updatedStudent.id}`, student: updatedStudent });
        })
        .catch((err) => {
            res.send('Error updating student ', err);
        });
}

function deleteStudent(req, res) {
   // const { studentId } = req.params;
    const { id } = req.params;

    Student.findByIdAndDelete(id)
        .then((deletedStudent) => {
            if (!deletedStudent) {
                console.log("studentId : ",id);
                
                return res.status(404).send('Student not found!');
            }
            res.json({ message: `Student deleted with id ${deletedStudent.id}` });
        })
        .catch((err) => {
            res.send('Error deleting student ', err);
        });
}

function getById(req, res) {
    const studentId = req.params.id;

    Student.findById(studentId).then((student) => {
        if (!student) {
            return res.status(404).send({ message: 'Étudiant non trouvé' });
        }
        res.send(student);
    }).catch((err) => {
        res.status(500).send({ message: 'Erreur du serveur', error: err });
    });
}


module.exports = {getAll, create, update, deleteStudent, getById};
