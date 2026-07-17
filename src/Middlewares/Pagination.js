import Joi from "joi";

export const paginationValidation = (forWhat = "body") => {
  const validator = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  });
  const querySchema = validator;
  return (req, res, next) => {
    
    if (forWhat === "body") {
      const validData = validator.validate(req.body);
      if (validData.error) {
        return validationError({
          req,
          res,
          next,
          errors: validData.error.details,
        });
      }
      req.body = { ...req.body, ...validData.value };
    } else if (forWhat === "query") {
      const validData = querySchema.validate(req.query, {
        convert: true,
      });
      if (validData.error) {
        return validationError({
          req,
          res,
          next,
          errors: validData.error.details,
        });
      }
      req.pagination = { ...req.query, ...validData.value };
    }
    next();
  };
};
