const prisma = require('../prisma/prismaClient');  // Import Prisma client
const AppError = require("../utils/AppError");

// POST API to Insert a New User
exports.createUser = async (req, res, next) => {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
        return next(new AppError('Name and Email are required', 400));
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
        return next(new AppError('Error creating user', 500));
    }
};

exports.getUser = async (req, res, next) => {
    const userId = parseInt(req.params.id);  // Get the user ID from the URL parameter

    // Validate if the ID is a valid number
    if (isNaN(userId)) {
        return next(new AppError('Invalid User ID', 400));
    }

    try {
        // Retrieve the user from the database by ID
        const user = await prisma.user.findUnique({
            where: {
                id: userId,  // Using the ID to query the user
            },
        });

        if (!user) {
            return next(new AppError('User not found', 400));
        }

        // Return the user object
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return next(new AppError('Error retrieving user', 500));
    }
};
