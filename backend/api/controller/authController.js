const { createTeacher ,getTeacherByEmail} = require('../models/teacherModels');
const { createStudent ,getStudentByEmail} = require('../models/studentModels');
const {bcrypt} = require('../models/database');
const { generateToken } = require('../services/auth');


handleCreateTeacher = async (req, res) => {
    try {
        const teacherData = req.body;
        const newTeacher = await createTeacher(teacherData);
        const token = generateToken(newTeacher); // Generate token for the new teacher
        res.cookie('teacher', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleLoginTeacher = async (req, res) => {
    const { email, password } = req.body;
    try {
        const teacher = await getTeacherByEmail(email);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(teacher);
        res.cookie('teacher', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.json({ message: 'Login successful',first_name:teacher.first_name,last_name:teacher.last_name });
    } catch (error) {
        console.error('Error logging in teacher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleCreateStudent = async (req, res) => {
    try {
        const studentData = req.body;
        const newStudent = await createStudent(studentData);
        const token = generateToken(newStudent); // Generate token for the new student
        res.cookie('student', token, {
            
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.status(201).json({ message: 'Login successful' }); // Exclude password from response
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleLoginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await getStudentByEmail(email);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(student);
        res.cookie('student', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.json({ message: 'Login successful',first_name:student.first_name,last_name:student.last_name});
    } catch (error) {
        console.error('Error logging in student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    handleCreateTeacher,
    handleCreateStudent,
    handleLoginTeacher,
    handleLoginStudent
}