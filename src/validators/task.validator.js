const Joi = require('joi');
const { PRIORITIES, STATUSES } = require('../utils/constants');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('', null),
  priority: Joi.string().valid(...PRIORITIES).default('Low'),
  status: Joi.string().valid(...STATUSES).default('Pending')
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().allow('', null),
  priority: Joi.string().valid(...PRIORITIES),
  status: Joi.string().valid(...STATUSES)
}).min(1);

module.exports = { createTaskSchema, updateTaskSchema };
