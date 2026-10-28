const { Op } = require('sequelize');
const { Student, Enrollment, Course } = require('../models');

// Create a new Student
exports.createStudent = async (req, res, next) => {
  try {
    const { studentIdNumber, email } = req.body;

    const existingStudent = await Student.findOne({
      where: {
        [Op.or]: [{ studentIdNumber }, { email }]
      }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'A student with this Student ID or Email already exists'
      });
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Get all students with search, filter, sort, and pagination
exports.getAllStudents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      status,
      enrollmentYear,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by department
    if (department) {
      whereClause.department = { [Op.like]: `%${department}%` };
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by enrollment year
    if (enrollmentYear) {
      whereClause.enrollmentYear = enrollmentYear;
    }

    // Search by firstName, lastName, studentIdNumber, email, or department
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { studentIdNumber: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Student.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder.toUpperCase()]]
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

// Get single student by ID with enrollments
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'courseCode', 'title', 'credits', 'instructor']
            }
          ]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Update student by ID
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    // Check duplicate if updating email or studentIdNumber
    if (req.body.email || req.body.studentIdNumber) {
      const conflictWhere = {
        id: { [Op.ne]: id },
        [Op.or]: []
      };
      if (req.body.email) conflictWhere[Op.or].push({ email: req.body.email });
      if (req.body.studentIdNumber) conflictWhere[Op.or].push({ studentIdNumber: req.body.studentIdNumber });

      const duplicate = await Student.findOne({ where: conflictWhere });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another student already has this email or student ID'
        });
      }
    }

    await student.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Delete student by ID
exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    await student.destroy();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
