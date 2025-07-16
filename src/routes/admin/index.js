const router = require("express").Router();
const { changeUserStatus } = require("../../controller/adminController");

router.get("/", (req, res) => {
  res.send("Admin API running...");
});

router.post("/change-status/:userId", changeUserStatus);
/**
 * @swagger
 * /api/admin/change-status/{userId}:
 *   post:
 *     summary: Change a user's status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Only Admins can change a user's status using their user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose status is being updated
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
 *         description: User status updated successfully
 *       400:
 *         description: Status field is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


module.exports = router;
