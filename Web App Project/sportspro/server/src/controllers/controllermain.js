const { Op } = require('sequelize');
const { Incident, Customer, Technician, Product } = require('../models');


/**
 * API Documentation
 * /{modelName}:
 *   get:
 *     summary: Get all records from a model
 *     description: Fetches all records from the specified Sequelize model with optional filtering.
 *     parameters:
 *       - in: query
 *         name: lastname
 *         schema:
 *           type: string
 *         description: Filter by partial, case-insensitive last name.
 *       - in: query
 *         name: firstname
 *         schema:
 *           type: string
 *         description: Filter by partial, case-insensitive first name.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by partial, case-insensitive email.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by partial, case-insensitive title (incidents only).
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by partial, case-insensitive description (incidents only).
 *     responses:
 *       200:
 *         description: List of records matching the filters.
 *       500:
 *         description: Server error while fetching records.
 */
const getAll = (Model) => async (req, res) => {
    const queryOptions = {};
    const filters = req.query || {};
    const partialMatchFields = ['lastname', 'firstname', 'email', 'title', 'description'];
    const modelFields = Object.keys(Model.rawAttributes);

    queryOptions.where = {};

    //handling for Incident model to include associations and filters
    if (Model.name === 'Incident') {
        const { Customer, Technician, Product } = require('../models');
        
        const customerWhere = {};
        const technicianWhere = {};
        const productWhere = {};

        if (filters.customerFirstname) customerWhere.firstname = { [Op.iLike]: `%${filters.customerFirstname}%` };
        if (filters.customerLastname) customerWhere.lastname = { [Op.iLike]: `%${filters.customerLastname}%` };

        if (filters.techFirstname) technicianWhere.firstname = { [Op.iLike]: `%${filters.techFirstname}%` };
        if (filters.techLastname) technicianWhere.lastname = { [Op.iLike]: `%${filters.techLastname}%` };

        if (filters.productName) productWhere.name = { [Op.iLike]: `%${filters.productName}%` };

        if (filters.techid) {
            queryOptions.where.techid = filters.techid;
            delete filters.techid; 
        }

        queryOptions.include = [
            {
                model: Customer,
                as: 'customer',
                where: Object.keys(customerWhere).length ? customerWhere : undefined,
                required: Object.keys(customerWhere).length > 0,
                attributes: ['customerid', 'firstname', 'lastname']
            },
            {
                model: Technician,
                as: 'technician',
                where: Object.keys(technicianWhere).length ? technicianWhere : undefined,
                required: Object.keys(technicianWhere).length > 0,
                attributes: ['techid', 'firstname', 'lastname']
            },
            {
                model: Product,
                as: 'product',
                where: Object.keys(productWhere).length ? productWhere : undefined,
                required: Object.keys(productWhere).length > 0,
                attributes: ['productcode', 'name']
            }
        ];

        delete filters.customerFirstname;
        delete filters.customerLastname;
        delete filters.techFirstname;
        delete filters.techLastname;
        delete filters.productName;
    }

    for (const key in filters) {
        if (!Object.prototype.hasOwnProperty.call(filters, key)) continue;

        if (!modelFields.includes(key)) {
            console.warn(`Ignoring unknown filter field: "${key}"`);
            continue;
        }

        if (partialMatchFields.includes(key)) {
            queryOptions.where[key] = { [Op.iLike]: `%${filters[key]}%` };
        } else {
            queryOptions.where[key] = filters[key];
        }
    }

    try {
      const items = await Model.findAll(queryOptions)
        return res.status(200).json(items);
    } catch(error) { //error handling
            console.error(`Cannot fetch: ${Model.tableName}:`, error);
            return res.status(500).json({ message: `Cannot fetch: ${Model.tableName}`, error: error.message });
        };
};

/**
 * API documentation
 * /{modelName}/{id}:
 *   get:
 *     summary: Get a single record by primary key
 *     description: Fetches a single record from the specified Sequelize model by its primary key.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The primary key of the item.
 *     responses:
 *       200:
 *         description: Record found.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Server error while fetching the record.
 */
const getByPk = (Model, pkParamName) =>  async (req, res) => {
  const pkValue = req.params[pkParamName];
  const queryOptions = {};

  if (Model.tableName === 'Incident') {
    const { Customer, Technician, Product } = require('../models');
    queryOptions.include = [
      { model: Customer, as: 'customer', attributes: ['customerid', 'firstname', 'lastname'] },
      { model: Technician, as: 'technician', attributes: ['techid', 'firstname', 'lastname'] },
      { model: Product, as: 'product', attributes: ['productcode', 'name'] }
    ];
  }

  try {
    const item = await Model.findByPk(pkValue, queryOptions)
      if (item) {
        return res.status(200).json(item);
      } else {
        return res.status(404).json({ message: `${Model.tableName} not found` });
      }
    } catch(error) { //error handling
      console.error(`Cannot fetch: ${Model.tableName} by ${pkParamName}:`, error);
      return res.status(500).json({ message: `Cannot fetch: ${Model.tableName}`, error: error.message });
    };
};

module.exports = {
  getAll,
  getByPk
};
