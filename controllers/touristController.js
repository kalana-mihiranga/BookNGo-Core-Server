require("dotenv").config();
const prisma = require("../prisma/prismaClient");
const AppError = require("../utils/AppError");
const { CREATE_EVENT_MODEL } = require("../validation/business");
const validateRequest = require("../utils/validateRequest");

exports.eventBook = async (req, res, next) => {
  try {
    const { eventId, priceCategoryId, ticketCount, paymentAmount } = req.body;
    const touristId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: touristId },
      include: {
        business: true,
        tourist: true,
      },
    });

    if (user.role !== "TOURIST" || !user.tourist) {
      return next(new AppError("Only tourist users can book events", 403));
    }

    const existingBooking = await prisma.touristEventBooking.findFirst({
      where: {
        touristId: user.tourist.id,
        eventId,
      },
    });

    if (existingBooking) {
      return next(new AppError("Event already booked by this user", 409));
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        maximumCount: true,
        bookings: {
          select: { ticketCount: true },
        },
      },
    });

    if (!event) {
      return next(new AppError("Event not found", 404));
    }

    const currentCount = event.bookings.reduce(
      (sum, b) => sum + b.ticketCount,
      0
    );
    const newTotal = currentCount + ticketCount;

    if (newTotal > event.maximumCount) {
      return next(
        new AppError(
          `Not enough tickets available. Only ${
            event.maximumCount - currentCount
          } left.`,
          400
        )
      );
    }

    const priceCategory = await prisma.priceCategory.findFirst({
      where: {
        id: priceCategoryId,
        eventId: eventId,
      },
    });

    if (!priceCategory) {
      return next(
        new AppError("Invalid price category for the selected event.", 400)
      );
    }

    const expectedAmount = priceCategory.price * ticketCount;
    if (expectedAmount !== paymentAmount) {
      return next(
        new AppError(
          `Incorrect payment amount. Expected ${expectedAmount}, got ${paymentAmount}`,
          400
        )
      );
    }

    await prisma.touristEventBooking.create({
      data: {
        touristId: user.tourist.id,
        eventId,
        priceCategoryId,
        ticketCount,
        paymentAmount,
      },
    });

    res.status(201).json({
      status: true,
      message: "Booking Success",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
