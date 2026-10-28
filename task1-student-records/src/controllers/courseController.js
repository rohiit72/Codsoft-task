const { Op } = require('sequelize');
const { Course, Enrollment, Student } = require('../models');

// Create a new Course
exports.createCourse = async (req, res, next) => {
  try {
    const { courseCode } = req.body;

    const existingCourse = await Course.findOne({
      where: { courseCode: courseCode.toUpperCase() }
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: `Course with code ${courseCode} already exists`
      });
    }

    const course = await Course.create({
      ...req.body,
      courseCode: courseCode.toUpperCase()
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Get all courses with search, filtering, sorting, pagination
exports.getAllCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      instructor,
      credits,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (department) {
      whereClause.department = { [Op.like]: `%${department}%` };
    }

    if (instructor) {
      whereClause.instructor = { [Op.like]: `%${instructor}%` };
    }

    if (credits) {
      whereClause.credits = credits;
    }

    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { courseCode: { [Op.like]: `%${search}%` } },
        { title: { [Op.like]: `%${search}%` } },
        { instructor: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Course.findAndCountAll({
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

// Get course by ID with enrolled students count and details
exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'studentIdNumber', 'firstName', 'lastName', 'email', 'department']
            }
          ]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Update course by ID
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${id} not found`
      });
    }

    if (req.body.courseCode) {
      const codeUpper = req.body.courseCode.toUpperCase();
      const duplicate = await Course.findOne({
        where: {
          id: { [Op.ne]: id },
          courseCode: codeUpper
        }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Another course with code ${codeUpper} already exists`
        });
      }
      req.body.courseCode = codeUpper;
    }

    await course.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${id} not found`
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
