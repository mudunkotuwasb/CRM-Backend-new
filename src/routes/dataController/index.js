const router = require("express").Router();
const { checkRole } = require("../../controller/auth");
const ROLES = require("../../utils/roles");
const { 
    deleteTemporarily,
    restoreRecord,
    deletePermanently,
    deleteAll
 } = require("../../controller/dataController");

router.get("/", (req, res) => {
    res.send("Data Controller API running...");
});

router.delete("/deleteTemporarily", checkRole([ROLES.admin, ROLES.company_representative]), deleteTemporarily);
/**
 * @swagger
 * /api/dataController/deleteTemporarily:
 *   delete:
 *     summary: Soft delete a record
 *     tags: [Admin, Company Representative]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The MongoDB ObjectId of the record
 *     responses:
 *       200:
 *         description: Record deleted temporarily
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data deleted temporarily
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */

router.put("/restoreRecord", checkRole([ROLES.admin]), restoreRecord);
/**
 * @swagger
 * /api/dataController/restoreRecord:
 *   put:
 *     summary: Restore a soft-deleted contact
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The MongoDB ObjectId of the document
 *     responses:
 *       200:
 *         description: Data restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Record restored successfully.
 *       400:
 *         description: Invalid type or ID
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */

router.delete("/deletePermanently", checkRole([ROLES.admin]), deletePermanently);
/**
 * @swagger
 * /api/dataController/deletePermanently:
 *   delete:
 *     summary: Permanently delete a soft-deleted record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: id
 *             properties:
 *               id:
 *                 type: string
 *                 description: MongoDB ObjectId of the soft‑deleted document
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: contact deleted permanently.
 *       400:
 *         description: Invalid type or ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid type
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No deleted contact found with this ID.
 *       500:
 *         description: Internal server error
 */

router.delete("/deleteAll", checkRole([ROLES.admin]), deleteAll);
/**
 * @swagger
 * /api/dataController/deleteAll:
 *   delete:
 *     summary: Permanently delete all records with isDeleted = true across all models
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Permanently deletes all records marked as isDeleted = true in all models that have this field. Only accessible by Admins.
 *     responses:
 *       200:
 *         description: All temporarily deleted records permanently removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All temporarily deleted records permanently removed.
 *       500:
 *         description: Internal server error
 */

module.exports = router;