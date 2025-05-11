
const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');

// Test route
router.post('/test', controller.adminTest);

// Get pending approval events
router.get('/approvals/pending-approval', controller.getPendingApprovals);

// Get history events
router.get('/approvals/history', controller.getApprovedEvents);
router.put('/approvals/:id', controller.updateApprovalStatus);

module.exports = router;