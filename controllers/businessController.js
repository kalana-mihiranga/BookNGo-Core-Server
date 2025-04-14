require("dotenv").config();
const prisma = require("../prisma/prismaClient");
const AppError = require("../utils/AppError");
const { CREATE_EVENT_MODEL } = require('../validation/business');
const validateRequest = require('../utils/validateRequest');

const handleValidation = (reqBody, validationModel) => {
    const validationErrors = validateRequest(reqBody, validationModel);
    if (validationErrors) {
        return { status: false, message: "Validation failed", validationErrors };
    }
    return null;
};

exports.addEvent = async (req, res, next) => {
  try {
    const validationResult = handleValidation(req.body, CREATE_EVENT_MODEL);
    if (validationResult) return res.status(402).json(validationResult);

    const business = await prisma.business.findUnique({
      where: { id: req.body.businessId },
    });

    if (!business) {
        return next(new AppError("Business not found.", 400));
    }

    const existingEvent = await prisma.event.findFirst({
        where:  {
            businessId: req.body.businessId,
            date: new Date(req.body.date),
            OR: [
                {
                    startTime: {
                        lt: req.body.endTime,
                    },
                    endTime: {
                        gt: req.body.startTime,
                    },
                }
            ]
        }
    })

    if (existingEvent) {
        return next(new AppError("Time slot already booked for another event.", 401));
    }
    
    const event = await prisma.event.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        category: req.body.category,
        maximumCount: req.body.maximumCount,
        cordinatorName: req.body.cordinatorName,
        cordinatorContact: req.body.cordinatorContact,
        description: req.body.description,
        hashtag: req.body.hashtag,
        location: req.body.location,
        country: req.body.country,
        discount: req.body.discount,
        refundPolicy: req.body.refundPolicy,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        date: new Date(req.body.date),
        bannerUrl: req.body.bannerUrl,
        businessId: req.body.businessId,
      },
    });

    res.status(200).json({ status: true, message: "Event created", body: event });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
