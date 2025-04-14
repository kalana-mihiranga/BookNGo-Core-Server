const Joi = require("joi");

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

exports.CREATE_EVENT_MODEL = Joi.object({
  businessId: Joi.number().integer().required().messages({
    "number.base": "Business ID must be a number.",
    "any.required": "Business ID is required.",
  }),
  name: Joi.string().required().messages({
    "any.required": "Event name is required.",
  }),
  type: Joi.string().required().messages({
    "any.required": "Event type is required.",
  }),
  category: Joi.string().required().messages({
    "any.required": "Event category is required.",
  }),
  maximumCount: Joi.number().integer().min(1).required().messages({
    "number.base": "Maximum count must be a number.",
    "number.min": "Maximum count must be at least 1.",
    "any.required": "Maximum count is required.",
  }),
  cordinatorName: Joi.string().required().messages({
    "any.required": "Coordinator name is required.",
  }),
  cordinatorContact: Joi.string().required().messages({
    "any.required": "Coordinator contact is required.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
  }),
  hashtag: Joi.string().required().messages({
    "any.required": "Hashtag is required.",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required.",
  }),
  country: Joi.string().required().messages({
    "any.required": "Country is required.",
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Discount must be a number.",
    "number.min": "Discount cannot be negative.",
    "number.max": "Discount cannot exceed 100%.",
  }),
  refundPolicy: Joi.string().required().messages({
    "any.required": "Refund policy is required.",
  }),
  startTime: Joi.string().pattern(timeRegex).required().messages({
    "string.pattern.base": "Start time must be in HH:mm format (e.g. 17:00).",
    "any.required": "Start time is required.",
  }),
  endTime: Joi.string().pattern(timeRegex).required().messages({
    "string.pattern.base": "End time must be in HH:mm format (e.g. 22:00).",
    "any.required": "End time is required.",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid date.",
    "date.format": "Date must be in ISO format.",
    "any.required": "Date is required.",
  }),
  bannerUrl: Joi.string().uri().optional().messages({
    "string.uri": "Banner URL must be a valid URI.",
  }),
});
