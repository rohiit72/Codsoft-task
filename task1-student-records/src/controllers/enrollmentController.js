const { Op } = require('sequelize');
const { Enrollment, Student, Course } = require('../models');

// Create Enrollment
exports.createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseId, enrollmentDate, grade, status } = req.body;

    // Check student existence
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${studentId} does not exist`
      });
    }

    // Check course existence
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} does not exist`
      });
    }

    // Check if duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId }
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }

    // Check course capacity (only counting Active 'Enrolled' status)
    const activeEnrollmentsCount = await Enrollment.count({
      where: {
        courseId,
        status: 'Enrolled'
      }
    });

    if (activeEnrollmentsCount >= course.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Course capacity reached (${course.maxCapacity} students). Cannot enroll.`
      });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      grade: grade || 'Pending',
      status: status || 'Enrolled'
    });

    const populatedEnrollment = await Enrollment.findByPk(enrollment.id, {
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentIdNumber', 'firstName', 'lastName', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'courseCode', 'title', 'credits', 'instructor'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Student successfully enrolled in course',
      data: populatedEnrollment
    });
  } catch (error) {
    next(error);
  }
};

// Get all enrollments with search, filter, and pagination
exports.getAllEnrollments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      studentId,
      courseId,
      status,
      grade,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (studentId) whereClause.studentId = studentId;
    if (courseId) whereClause.courseId = courseId;
    if (status) whereClause.status = status;
    if (grade) whereClause.grade = grade;

    const { count, rows } = await Enrollment.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentIdNumber', 'firstName', 'lastName', 'email', 'department'] },
        { model: Course, as: 'course', attributes: ['id', 'courseCode', 'title', 'credits', 'instructor'] }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page, 10),
        itemsPerPage: parseInt(limit, 10),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        { model: Student, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: `Enrollment with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Update enrollment (grade, status)
exports.updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: `Enrollment with ID ${id} not found`
      });
    }

    await enrollment.update(req.body);

    const updated = await Enrollment.findByPk(id, {
      include: [
        { model: Student, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: `Enrollment with ID ${id} not found`
      });
    }

    await enrollment.destroy();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all enrollments for a specific student
exports.getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId: id },
      include: [{ model: Course, as: 'course' }],
      order: [['enrollmentDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student.id,
          studentIdNumber: student.studentIdNumber,
          name: `${student.firstName} ${student.lastName}`,
          department: student.department
        },
        enrollments
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all enrolled students for a specific course
exports.getStudentsByCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${id} not found`
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { courseId: id },
      include: [{ model: Student, as: 'student' }],
      order: [['enrollmentDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        course: {
          id: course.id,
          courseCode: course.courseCode,
          title: course.title,
          instructor: course.instructor,
          enrolledCount: enrollments.length,
          maxCapacity: course.maxCapacity
        },
        enrolledStudents: enrollments
      }
    });
  } catch (error) {
    next(error);
  }
};
