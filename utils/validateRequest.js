const validateRequest = (body, schema) => {
    const { error } = schema.validate(body, { abortEarly: false }); // Capture all errors
    if (!error) return null;

    const errorDetails = {};

    error.details.forEach(err => {
        const field = err.path[0]; // Extract field name (e.g., name/email)
        if (!errorDetails[field]) {
            errorDetails[field] = []; // Initialize array if not exists
        }
        errorDetails[field].push(err.message);
    });

    return errorDetails;
};

module.exports = validateRequest;