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
        specifications: {
          create: req.body.specifications,
        },
        conditions: {
          create: req.body.conditions,
        },
        priceCategories: {
          create: req.body.priceCategories,
        },
      },
    });

    res.status(200).json({ status: true, message: "Event created", body: event });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.searchEvents = async (req, res, next) => {
  try {
    const { name, hashtag, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(name && {
        name: {
          contains: name,
        },
      }),
      ...(hashtag && {
        hashtag: {
          contains: hashtag,
        },
      }),
    };

    const events = await prisma.event.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { date: 'asc' },
    });

    const total = await prisma.event.count({ where });

    res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
      events,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);

    if (!eventId) {
      return next(new AppError("Invalid event ID.", 400));
    }

    const existingEvent = await prisma.event.findUnique({
      where: {id: eventId},
    });

    if (!existingEvent) {
      return next(new AppError("Event not found.", 404));
    }

    //check conflict with other events (date and time)
    const conflictEvent = await prisma.event.findFirst({
      where: {
        id: {not: eventId},
        businessId: req.body.businessId ?? existingEvent.businessId,
        date: new Date(req.body.date ?? existingEvent.date),
        startTime: {lt: req.body.endTime ?? existingEvent.endTime},
        endTime: {gt: req.body.startTime ?? existingEvent.startTime},
      },
    });

    if (conflictEvent) {
      return next(new AppError("Another event is already scheduled during the same time.", 409));
    }

    console.log("bgvvsghxvsgxvgsvxgs - ok")

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
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
        date: req.body.date ? new Date(req.body.date) : undefined,
        bannerUrl: req.body.bannerUrl,
        businessId: req.body.businessId,
      },
    });

    res.status(200).json({
      status: true,
      message: "Event updated.",
      body: updatedEvent,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}
