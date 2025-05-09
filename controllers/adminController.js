// controllers/eventApprovalController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VALID_ACTIONS = ["CREATE", "UPDATE"];
const VALID_CATEGORY = ["EVENT", "BUSINESS"];

exports.adminTest = async (req, res) => {
    res.json({ message: "test" });
};

exports.getPendingApprovals = async (req, res) => {
    const { category } = req.query;

    // if (!category || !VALID_CATEGORY.includes(category)) {
    //     return res.status(400).json({ error: "Invalid or missing category. Use 'EVENT' or 'BUSINESS'." });
    // }

    try {
        const pendingApprovals = await prisma.approval.findMany({
            where: {
                status: 'PENDING',
            },
            include: {
                event: true,
                business: true,
            },
        });
        res.json(pendingApprovals);
    } catch (err) {
        console.error('Error fetching pending approvals:', err);
        res.status(500).json({ error: 'Failed to fetch pending approvals' });
    }
};

exports.getApprovedEvents = async (req, res) => {
    try {
        const approvals = await prisma.approval.findMany({
            where: {
                status: {
                    in: ['APPROVED', 'REJECTED']
                }
            },
            include: {
                event: true,
                business: true
            }
        });
        res.json(approvals);
    } catch (err) {
        console.error('Error fetching approved events:', err);
        res.status(500).json({ error: 'Failed to fetch approved events' });
    }
};
exports.updateApprovalStatus = async (req, res) => {
    const approvalId = parseInt(req.params.id);
    const { status, authorizedBy } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const updated = await prisma.approval.update({
            where: { id: approvalId },
            data: {
                status,
                authorizedBy: "authorizedBy",
                authorizedAt: new Date(),
            },
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating approval status:', error);
        res.status(500).json({ error: 'Failed to update approval status' });
    }
};


