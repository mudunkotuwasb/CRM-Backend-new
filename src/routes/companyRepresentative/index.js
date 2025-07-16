const router = require("express").Router();
const {
    addBusiness,
    updateBusiness,
    getAllBusinesses,
    getBusinessById,
    searchBusinessesByName,
    changeBusinessStatus,
    changeBusinessLastInteraction,
    getBusinessesByStatus
} = require("../../controller/businessController");

const {
    addContact,
    updateContact,
    getAllContacts,
    getContactsByEmail,
    changeContactStatus,
    getContactsByStatus
} = require("../../controller/contactController")

const { newRequest } = require("../../controller/handleRequest");

router.get("/", (req, res) => {
    res.send("Company Representative API running...");
});

router.post("/addBusiness", addBusiness);
/**
 * @swagger
 * /api/company-representative/addBusiness:
 *   post:
 *     summary: Add a new business
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new business. Accessible by Admin and Company Representative roles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - industry
 *               - companySize
 *               - location
 *               - website
 *               - status
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: "ABCDEF"
 *               industry:
 *                 type: string
 *                 example: "Technology"
 *               companySize:
 *                 type: string
 *                 example: "10-50 employees"
 *               location:
 *                 type: string
 *                 example: "Galle"
 *               website:
 *                 type: string
 *                 example: "https://example.com"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PROSPECT, LEAD]
 *                 example: "LEAD"
 *     responses:
 *       201:
 *         description: Business created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 business:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     businessName:
 *                       type: string
 *                     industry:
 *                       type: string
 *                     companySize:
 *                       type: string
 *                     location:
 *                       type: string
 *                     website:
 *                       type: string
 *                     contact:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     last_interaction:
 *                       type: string
 *                       format: date-time
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *       400:
 *         description: Validation error or missing fields
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Internal Server Error
 */

router.put("/updateBusiness/:id", updateBusiness);
/**
 * @swagger
 * /api/company-representative/updateBusiness/{id}:
 *   put:
 *     summary: Update a business
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to update business information by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               industry:
 *                 type: string
 *               companySize:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PROSPECT, LEAD]
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/allBusiness", getAllBusinesses);
/**
 * @swagger
 * /api/company-representative/allBusiness:
 *   get:
 *     summary: Get all businesses
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve all businesses.
 *     responses:
 *       200:
 *         description: List of all businesses
 *       500:
 *         description: Internal Server Error
 */

router.get("/searchBusiness/:id", getBusinessById);
/**
 * @swagger
 * /api/company-representative/searchBusiness/{id}:
 *   get:
 *     summary: Get a business by ID
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve a business by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to retrieve
 *     responses:
 *       200:
 *         description: Business found successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal Server Error
 */

router.post("/searchBusinessByName", searchBusinessesByName);
/**
 * @swagger
 * /api/company-representative/searchBusinessByName:
 *   post:
 *     summary: Search businesses by name
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: (Non-standard) GET request with body to search businesses. Recommended to use POST instead.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: "tech"
 *     responses:
 *       200:
 *         description: Matching businesses retrieved successfully
 *       400:
 *         description: Business name is required
 *       404:
 *         description: No matching businesses found
 *       500:
 *         description: Internal Server Error
 */

router.put("/changeBusinessStatus/:id", changeBusinessStatus);
/**
 * @swagger
 * /api/company-representative/changeBusinessStatus/{id}:
 *   put:
 *     summary: Change the status of a business
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to change the status of a business by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business status updated 
 *       404:
 *         description: Business not found
 *       400:
 *         description: Status is required
 *       500:
 *         description: Internal Server Error
 */

router.put("/changeBusinessLastInteraction/:id", changeBusinessLastInteraction);
/**
 * @swagger
 * /api/company-representative/changeBusinessLastInteraction/{id}:
 *   put:
 *     summary: Change the last interaction date of a business
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to change the last interaction date of a business by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - last_interaction
 *             properties:
 *               last_interaction:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Business last interaction date updated
 *       404:
 *         description: Business not found
 *       400:
 *         description: Last interaction date is required
 *       500:
 *         description: Internal Server Error
 */

router.post("/getBusinessByStatus", getBusinessesByStatus);
/**
 * @swagger
 * /api/company-representative/getBusinessByStatus:
 *   post:
 *     summary: Get businesses by status
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve businesses by their status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PROSPECT, LEAD]
 *                 example: "ACTIVE"
 *     responses:
 *       200:
 *         description: Businesses retrieved successfully
 *       400:
 *         description: Status is required
 *       404:
 *         description: No businesses found with the specified status
 *       500:
 *         description: Internal Server Error
 */

router.post("/addContact", addContact);
/**
 * @swagger
 * /api/company-representative/addContact:
 *   post:
 *     summary: Add a new contact
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new contact. Only accessible by Admin and Company Representative roles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - roleTitle
 *               - company
 *               - email
 *               - phone
 *               - department
 *               - status
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               roleTitle:
 *                 type: string
 *                 example: "Sales Lead"
 *               company:
 *                 type: string
 *                 example: "64f5b2c1abc1234567890def"
 *                 description: Business ID
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               department:
 *                 type: string
 *                 example: "Sales"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PROSPECT, LEAD]
 *                 example: "LEAD"
 *               assignedTo:
 *                 type: string
 *                 example: "64f6a7b3def7894561230cba"
 *                 description: User ID
 *     responses:
 *       201:
 *         description: Contact added successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden – not allowed
 *       404:
 *         description: Business/User not found
 *       500:
 *         description: Internal Server Error
 */

router.put("/updateContact/:id", updateContact);
/**
 * @swagger
 * /api/company-representative/updateContact/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admins and Company Representatives to update an existing contact's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Updated Name"
 *               roleTitle:
 *                 type: string
 *                 example: "Business Manager"
 *               company:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f789012345"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               phone:
 *                 type: string
 *                 example: "+94771234567"
 *               department:
 *                 type: string
 *                 example: "Operations"
 *               status:
 *                 type: string
 *                 enum: [LEAD, PROSPECT, ACTIVE]
 *                 example: "ACTIVE"
 *               assignedTo:
 *                 type: string
 *                 example: "64f1b2a3d4e5f6a789012344"
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input or duplicate email
 *       404:
 *         description: Contact, Business, or Assigned User not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/allContacts", getAllContacts);
/**
 * @swagger
 * /api/company-representative/allContacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve all contacts.
 *     responses:
 *       200:
 *         description: List of all contacts
 *       500:
 *         description: Internal Server Error
 */

router.post("/getContactByEmail", getContactsByEmail);
/**
 * @swagger
 * /api/company-representative/getContactByEmail:
 *   post:
 *     summary: Get contacts by email
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve contacts by their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: List of contacts matching the email
 *       400:
 *         description: Invalid email format
 *       404:
 *         description: No contacts found
 *       500:
 *         description: Internal Server Error
 */

router.put("/changeContactStatus/:id", changeContactStatus);
/**
 * @swagger
 * /api/company-representative/changeContactStatus/{id}:
 *   put:
 *     summary: Change the status of a contact
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to change the status of a contact by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business status updated 
 *       404:
 *         description: Business not found
 *       400:
 *         description: Status is required
 *       500:
 *         description: Internal Server Error
 */

router.post("/getContactByStatus", getContactsByStatus);
/**
 * @swagger
 * /api/company-representative/getContactByStatus:
 *   post:
 *     summary: Get contacts by status
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve contacts by their status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PROSPECT, CONVERTED]
 *                 example: "ACTIVE"
 *     responses:
 *       200:
 *         description: Businesses retrieved successfully
 *       400:
 *         description: Status is required
 *       404:
 *         description: No businesses found with the specified status
 *       500:
 *         description: Internal Server Error
 */

router.post("/newRequest", newRequest);

module.exports = router;