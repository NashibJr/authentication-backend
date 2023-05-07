import Joi from "joi";

export const sigupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const activationCodeSchema = Joi.object({
  codeFromUser: Joi.number().min(7).required(),
});
