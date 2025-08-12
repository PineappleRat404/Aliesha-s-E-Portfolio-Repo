const { Incident, Product, Customer, Technician } = require('../models');

//NOTE: Get all functions are controlled by controllermain.js - keeps code manageable

/**
 * API documentation
 * /incidents:
 *   post:
 *     summary: Create a new incident
 *     tags: [Incidents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerid
 *               - productcode
 *               - techid
 *               - dateopened
 *               - title
 *               - description
 *             properties:
 *               customerid:
 *                 type: integer
 *               productcode:
 *                 type: string
 *               techid:
 *                 type: integer
 *               dateopened:
 *                 type: string
 *                 format: date
 *               dateclosed:
 *                 type: string
 *                 format: date
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Incident created
 *       500:
 *         description: Server error
 */
exports.createIncident = async (req, res) => { 
    try {
      const { customerid, productcode, techid, dateopened, dateclosed, title, description } = req.body;

      const newIncident = await Incident.create({
        customerid, 
        productcode, 
        techid, 
        dateopened, 
        dateclosed, 
        title, 
        description
      });

      return res.status(201).json({ message: 'Incident created!', incident: newIncident });
        } catch(error) { //error handling
            console.error('Error creating incident:', error);
            return res.status(500).json({ message: 'Error creating incident', error: error.message });
        }
};

/**
 * API documentation
 * /incidents/{incidentid}:
 *   put:
 *     summary: Update an existing incident
 *     tags: [Incidents]
 *     parameters:
 *       - in: path
 *         name: incidentid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the incident to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerid:
 *                 type: integer
 *               productcode:
 *                 type: string
 *               techid:
 *                 type: integer
 *               dateopened:
 *                 type: string
 *               dateclosed:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Incident updated
 *       400:
 *         description: No fields provided
 *       404:
 *         description: Incident not found
 *       500:
 *         description: Server error
 */
exports.updateIncident = async (req, res) => { 
    try {
      const incidentid = req.params.incidentid;
      const { customerid, productcode, techid, dateopened, dateclosed, title, description } = req.body;

      const updateFields = {};
      if (customerid !== undefined) updateFields.customerid = customerid;
      if (productcode !== undefined) updateFields.productcode = productcode;
      if (techid !== undefined) updateFields.techid = techid;
      if (dateopened !== undefined) updateFields.dateopened = dateopened;
      if (dateclosed !== undefined) updateFields.dateclosed = dateclosed;
      if (title !== undefined) updateFields.title = title;
      if (description !== undefined) updateFields.description = description;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const [updatedRowsCount, updatedIncidents] = await Incident.update(updateFields, {
            where: { incidentid: incidentid },
            returning: true,
        });

        if (updatedRowsCount > 0) {
          return res.status(200).json({ message: 'Incident updated!', incident: updatedIncidents[0] });
        } else {
          return res.status(404).json({ message: 'Incident not found!' });
        }
      } catch (error) {
        console.error('Error updating incident:', error);
        return res.status(500).json({ message: 'Error updating incident', error: error.message });
      }
    };

/**
 * APi documentation
 * /incidents/unassigned:
 *   get:
 *     summary: Get all unassigned incidents (techid is null)
 *     tags: [Incidents]
 *     responses:
 *       200:
 *         description: List of unassigned incidents
 *       500:
 *         description: Server error
 */
exports.getUnassignedIncidents = async (req, res) => {  
  try {
    const unassignedIncidents = await Incident.findAll({
    where: { techid: null },
    include: [
      { model: Customer, as: 'customer', attributes: ['customerid', 'firstname', 'lastname'] },
      { model: Technician, as: 'technician', attributes: ['techid', 'firstname', 'lastname'] },
      { model: Product, as: 'product', attributes: ['productcode', 'name'] }
    ]
  });

    return res.status(200).json(unassignedIncidents);
    } catch (error) {
      console.error('Error fetching unassigned incidents:', error);
      return res.status(500).json({ message: 'Error fetching unassigned incidents', error: error.message });
    }
  };

exports.getAssignedIncidents = async (req, res) => {
  const techid = req.query.techid;

  if (!techid) {
    return res.status(400).json({ message: 'Tech ID is required' });
  }

  try {
    const incidents = await Incident.findAll({ 
      where: { techid },
      include: [
        { model: Customer, as: 'customer', attributes: ['customerid', 'firstname', 'lastname'] },
        { model: Technician, as: 'technician', attributes: ['techid', 'firstname', 'lastname'] },
        { model: Product, as: 'product', attributes: ['productcode', 'name'] }
      ]
    });

    res.json(incidents);
  } catch (error) {
    console.error('Error fetching assigned incidents:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
