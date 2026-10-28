const { Op, fn, col } = require('sequelize');
const { Contact } = require('../models');

// Add a new contact
exports.createContact = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.body;

    // Check for duplicate entry by email or phone number
    const existing = await Contact.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }]
      }
    });

    if (existing) {
      const matchField = existing.email === email ? 'email' : 'phone number';
      return res.status(409).json({
        success: false,
        message: `A contact with this ${matchField} already exists`
      });
    }

    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve all contacts with search, filter, sorting, and pagination
exports.getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      companyName,
      city,
      isFavorite,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (companyName) {
      whereClause.companyName = { [Op.like]: `%${companyName}%` };
    }

    if (city) {
      whereClause.city = { [Op.like]: `%${city}%` };
    }

    if (typeof isFavorite !== 'undefined') {
      whereClause.isFavorite = isFavorite;
    }

    // Search functionality using name, email, or phone number
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
        { companyName: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Contact.findAndCountAll({
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

// Retrieve single contact by ID
exports.getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// Update contact
exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact with ID ${id} not found`
      });
    }

    // Check duplicate email or phone if being updated
    if (req.body.email || req.body.phoneNumber) {
      const conflictWhere = {
        id: { [Op.ne]: id },
        [Op.or]: []
      };
      if (req.body.email) conflictWhere[Op.or].push({ email: req.body.email });
      if (req.body.phoneNumber) conflictWhere[Op.or].push({ phoneNumber: req.body.phoneNumber });

      const duplicate = await Contact.findOne({ where: conflictWhere });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another contact already exists with this email or phone number'
        });
      }
    }

    await contact.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact
exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact with ID ${id} not found`
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get aggregate stats for contacts dashboard
exports.getContactStats = async (req, res, next) => {
  try {
    const total = await Contact.count();
    const favorites = await Contact.count({ where: { isFavorite: true } });

    const byCategory = await Contact.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category']
    });

    res.status(200).json({
      success: true,
      data: {
        totalContacts: total,
        totalFavorites: favorites,
        categoryBreakdown: byCategory
      }
    });
  } catch (error) {
    next(error);
  }
};
