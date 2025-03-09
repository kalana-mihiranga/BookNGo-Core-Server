const prisma = require('../prisma/prismaClient');  // Import Prisma client

// POST API to Insert a New User
exports.createUser = async (req, res) => {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required' });
    }

    try {
        // Insert new user into the database
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
            },
        });
        
        // Return the created user object
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.getUser = async (req, res) => {
    const userId = parseInt(req.params.id);  // Get the user ID from the URL parameter

    // Validate if the ID is a valid number
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        // Retrieve the user from the database by ID
        const user = await prisma.user.findUnique({
            where: {
                id: userId,  // Using the ID to query the user
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user object
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving user' });
    }
};
