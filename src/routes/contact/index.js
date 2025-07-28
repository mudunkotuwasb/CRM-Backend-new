const router = require("express").Router();
const {
    addContact,
    updateContact,
    getAllContacts,
    getContactsByEmail,
    changeContactStatus,
    getContactsByStatus
} = require("../../controller/contactController")

router.get("/", (req, res) => {
    res.send("Company Representative API running...");
});

router.post("/addContact", addContact);
/**
 * @swagger
 * /api/contact-manager/addContact:
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
 *               - Name
 *               - company
 *               - contactInfo
 *               - uploadedBy
 *               - uploadDate
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "John Doe"
 *               company:
 *                 type: string
 *                 example: "TechCorp"
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *               uploadedBy:
 *                 type: string
 *                 description: MongoDB User ID
 *                 example: "64f6a7b3def7894561230cba"
 *               uploadDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-17T12:00:00Z"
 *               assignedTo:
 *                 type: string
 *                 description: MongoDB User ID
 *                 example: "64f6a7b3def7894561230cba"
 *               status:
 *                 type: string
 *                 enum: [ASSIGNED, UNASSIGNED]
 *                 example: "UNASSIGNED"
 *               lastContact:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-10"
 *     responses:
 *       201:
 *         description: Contact added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden – not allowed
 *       404:
 *         description: Assigned user not found
 *       500:
 *         description: Internal Server Error
 */

router.put("/updateContact/:id", updateContact);
/**
 * @swagger
 * /api/contact-manager/updateContact/{id}:
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
 *               Name:
 *                 type: string
 *                 example: "John Doe"
 *               company:
 *                 type: string
 *                 example: "TechCorp"
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *               uploadedBy:
 *                 type: string
 *                 description: MongoDB User ID
 *                 example: "64f6a7b3def7894561230cba"
 *               uploadDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-17T12:00:00Z"
 *               assignedTo:
 *                 type: string
 *                 description: MongoDB User ID
 *                 example: "64f6a7b3def7894561230cba"
 *               status:
 *                 type: string
 *                 enum: [ASSIGNED, UNASSIGNED]
 *                 example: "UNASSIGNED"
 *               lastContact:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-10"
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
 *       400:
 *         description: Invalid input or duplicate email
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/allContacts", getAllContacts);
/**
 * @swagger
 * /api/contact-manager/allContacts:
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
 * /api/contact-manager/getContactByEmail:
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
 * /api/contact-manager/changeContactStatus/{id}:
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
 *         description: Contact status updated 
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Status is required
 *       500:
 *         description: Internal Server Error
 */

router.post("/getContactByStatus", getContactsByStatus);
/**
 * @swagger
 * /api/contact-manager/getContactByStatus:
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
 *                 enum: [ASSIGNED, UNASSIGNED]
 *                 example: "ACTIVE"
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *       400:
 *         description: Status is required
 *       404:
 *         description: No contacts found with the specified status
 *       500:
 *         description: Internal Server Error
 */

module.exports = router;