const router = require("express").Router();
const {
    addContact,
    updateContact,
    getAllContacts,
    getContactsByAdminId,
    changeContactStatus,
    getContactsByStatus,
    updateContactStatus,
    deleteContact,
    addNoteToContact,
    deleteContactHistory
} = require("../../controller/contactController");

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
router.post("/getContactsByAdminId", getContactsByAdminId);
/**
 * @swagger
 * /api/contact-manager/getContactsByAdminId:
 *   post:
 *     summary: Get contacts by admin ID
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     description: Allows Admin and Company Representative to retrieve contacts by admin ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminId
 *             properties:
 *               adminId:
 *                 type: string
 *                 example: "64a7b8c9d1e2f3g4h5i6j7k8"
 *     responses:
 *       200:
 *         description: List of contacts for the specified admin
 *       400:
 *         description: Invalid admin ID format
 *       404:
 *         description: No contacts found for this admin
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

router.post("/updateStatus", updateContactStatus);
/**
 * @swagger
 * /contact-manager/updateStatus:
 *   post:
 *     tags: [Company Representative]
 *     summary: Update contact status
 *     description: Update the status of a specific contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contactId, status]
 *             properties:
 *               contactId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               status:
 *                 type: string
 *                 enum: [UNASSIGNED, ASSIGNED, IN_PROGRESS, COMPLETED, PENDING, REJECTED]
 *                 example: "COMPLETED"
 *               lastContact:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:30:00.000Z"
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact status updated successfully"
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 */

router.delete("/delete/:id", deleteContact);
/**
 * @swagger
 * /contact-manager/delete/{id}:
 *   delete:
 *     tags: [Company Representative]
 *     summary: Delete a contact permanently
 *     description: Permanently delete a contact from the database (hard delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the contact to delete
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contact deleted successfully
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
 *                   example: "Contact permanently deleted successfully"
 *       400:
 *         description: Bad request - missing or invalid contact ID
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *       403:
 *         description: Forbidden - user doesn't have required role permissions
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */



router.post('/:id/notes', addNoteToContact);
/**
 * @swagger
 * /contacts/{id}/notes:
 *   post:
 *     tags: [Company Representative]
 *     summary: Add a note to a contact
 *     description: Add a new note with details about interaction with a contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the contact to add note to
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *               - outcome
 *             properties:
 *               notes:
 *                 type: string
 *                 description: The content of the note
 *                 example: "Had a productive call about potential partnership. Discussed pricing and timeline."
 *               outcome:
 *                 type: string
 *                 enum: [interested, not_interested, follow_up, no_response, callback]
 *                 description: Outcome of the interaction
 *                 example: "interested"
 *               nextAction:
 *                 type: string
 *                 description: Next action to be taken
 *                 example: "Schedule meeting"
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time for the next action (ISO format)
 *                 example: "2024-01-15T14:30:00.000Z"
 *     responses:
 *       201:
 *         description: Note added successfully
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
 *                   example: "Note added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Notes and outcome are required fields"
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *       403:
 *         description: Forbidden - user doesn't have permission to add notes to this contact
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */


router.delete("/:contactId/history/:historyId", deleteContactHistory);
/**
 * @swagger
 * /contacts/{contactId}/history/{historyId}:
 *   delete:
 *     tags: [Company Representative]
 *     summary: Delete a specific contact history entry
 *     description: Remove a specific contact history note from a contact's history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: contactId
 *         in: path
 *         required: true
 *         description: MongoDB ID of the contact
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *       - name: historyId
 *         in: path
 *         required: true
 *         description: Numeric ID of the history entry to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Contact history deleted successfully
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
 *                   example: "Contact history deleted successfully"
 *       400:
 *         description: Bad request - invalid contact ID or history ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid contact ID"
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *       403:
 *         description: Forbidden - user doesn't have permission to delete contact history
 *       404:
 *         description: Contact or contact history not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */


module.exports = router;