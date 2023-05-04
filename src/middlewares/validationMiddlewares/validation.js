const validateInputs = (req, resp, next) => (schema) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    return next();
  } else {
    return resp.status(500).json({
      message: error.details.map((detail) => detail.message.replace(/"/g, "")),
    });
  }
};

export default validateInputs;
