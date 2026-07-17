import Joi from "joi";
export const generalFeilds = {
  role_name: Joi.string().min(3).max(15).messages({
    "string.base": "ROLE_NAME_STRING",
    "string.empty": "ROLE_NAME_EMPTY",
    "string.min": "ROLE_NAME_MIN",
    "string.max": "ROLE_NAME_MAX",
    "any.required": "ROLE_NAME_REQUIRED",
  }),
  url: Joi.string().uri(),
  name: Joi.string().min(3).max(32).messages({
    "string.base": "NAME_STRING",
    "string.empty": "NAME_EMPTY",
    "string.min": "NAME_MIN",
    "string.max": "NAME_MAX",
    "any.required": "NAME_REQUIRED",
  }),
  email: Joi.string().email().messages({
    "string.base": "EMAIL_STRING",
    "string.empty": "EMAIL_EMPTY",
    "string.email": "EMAIL_INVALID",
    "any.required": "EMAIL_REQUIRED",
  }),
  address: Joi.string().min(3).max(100).messages({
    "string.base": "ADDRESS_STRING",
    "string.empty": "ADDRESS_EMPTY",
    "string.min": "ADDRESS_MIN",
    "string.max": "ADDRESS_MAX",
    "any.required": "ADDRESS_REQUIRED",
  }),
  codeCountry: Joi.string().required().messages({
    "string.base": "CODE_COUNTRY_STRING",
    "string.empty": "CODE_COUNTRY_EMPTY",
    "any.required": "CODE_COUNTRY_REQUIRED",
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#])[A-Za-z\\d@$!%*?&^#]{8,}$",
      ),
    )
    .messages({
      "string.base": "PASSWORD_STRING",
      "string.empty": "PASSWORD_EMPTY",
      "string.pattern.base": "PASSWORD_PATTERN",
      "any.required": "PASSWORD_REQUIRED",
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "CONFIRM_PASSWORD_ONLY",
    "any.required": "CONFIRM_PASSWORD_REQUIRED",
  }),
  gender: Joi.string().valid("male", "female").messages({
    "string.base": "GENDER_STRING",
    "string.empty": "GENDER_EMPTY",
    "any.only": "GENDER_ONLY",
    "any.required": "GENDER_REQUIRED",
  }),
  birth_date: Joi.date().iso().messages({
    "date.base": "BIRTH_DATE_BASE",
    "date.empty": "BIRTH_DATE_EMPTY",
    "date.format": "BIRTH_DATE_FORMAT",
    "any.required": "BIRTH_DATE_REQUIRED",
  }),
  date: Joi.date().iso(),
  country: Joi.string().messages({
    "string.base": "COUNTRY_STRING",
    "string.empty": "COUNTRY_EMPTY",
    "any.required": "COUNTRY_REQUIRED",
  }),
  phone: Joi.string()
    .pattern(new RegExp("^(?:\\+20|0020|0)?1[0125][0-9]{8}$"))
    .messages({
      "string.base": "PHONE_STRING",
      "string.empty": "PHONE_EMPTY",
      "string.pattern.base": "PHONE_PATTERN",
      "any.required": "PHONE_REQUIRED",
    }),
  idToken: Joi.string().messages({
    "string.base": "ID_TOKEN_STRING",
    "string.empty": "ID_TOKEN_EMPTY",
    "any.required": "ID_TOKEN_REQUIRED",
  }),
  provider: Joi.string().valid("google", "local").messages({
    "string.base": "PROVIDER_STRING",
    "string.empty": "PROVIDER_EMPTY",
    "any.only": "PROVIDER_ONLY",
    "any.required": "PROVIDER_REQUIRED",
  }),
  otp: Joi.string()
    .max(6)
    .min(6)
    .regex(/^[0-9]{6}$/)
    .messages({
      "string.base": "OTP_STRING",
      "string.empty": "OTP_EMPTY",
      "string.min": "OTP_MIN",
      "string.max": "OTP_MAX",
      "string.pattern.base": "OTP_PATTERN",
      "any.required": "OTP_REQUIRED",
    }),

  file: {
    fieldname: Joi.string().required().messages({
      "string.base": "FILE_FIELDNAME_STRING",
      "string.empty": "FILE_FIELDNAME_EMPTY",
      "any.required": "FILE_FIELDNAME_REQUIRED",
    }),
    originalname: Joi.string().required().messages({
      "string.base": "FILE_ORIGINALNAME_STRING",
      "string.empty": "FILE_ORIGINALNAME_EMPTY",
      "any.required": "FILE_ORIGINALNAME_REQUIRED",
    }),
    encoding: Joi.string().required().messages({
      "string.base": "FILE_ENCODING_STRING",
      "string.empty": "FILE_ENCODING_EMPTY",
      "any.required": "FILE_ENCODING_REQUIRED",
    }),
    mimetype: Joi.string().required().messages({
      "string.base": "FILE_MIMETYPE_STRING",
      "string.empty": "FILE_MIMETYPE_EMPTY",
      "any.required": "FILE_MIMETYPE_REQUIRED",
    }),
    finalPath: Joi.string().required().messages({
      "string.base": "FILE_FINALPATH_STRING",
      "string.empty": "FILE_FINALPATH_EMPTY",
      "any.required": "FILE_FINALPATH_REQUIRED",
    }),
    destination: Joi.string().required().messages({
      "string.base": "FILE_DESTINATION_STRING",
      "string.empty": "FILE_DESTINATION_EMPTY",
      "any.required": "FILE_DESTINATION_REQUIRED",
    }),
    filename: Joi.string().required().messages({
      "string.base": "FILE_FILENAME_STRING",
      "string.empty": "FILE_FILENAME_EMPTY",
      "any.required": "FILE_FILENAME_REQUIRED",
    }),
    path: Joi.string().required().messages({
      "string.base": "FILE_PATH_STRING",
      "string.empty": "FILE_PATH_EMPTY",
      "any.required": "FILE_PATH_REQUIRED",
    }),
    size: Joi.number().positive().required().messages({
      "number.base": "FILE_SIZE_NUMBER",
      "number.positive": "FILE_SIZE_POSITIVE",
      "any.required": "FILE_SIZE_REQUIRED",
    }),
  },

  id: Joi.string().uuid().messages({
    "string.base": "ID_STRING",
    "string.empty": "ID_EMPTY",
    "string.length": "ID_LENGTH",
    "any.required": "ID_REQUIRED",
  }),

  deviceId: Joi.string().optional().messages({
    "string.base": "DEVICE_ID_STRING",
    "string.empty": "DEVICE_ID_EMPTY",
    "any.required": "DEVICE_ID_REQUIRED",
  }),
  productId: Joi.string().uuid().messages({
    "string.base": "PRODUCT_ID_STRING",
    "string.empty": "PRODUCT_ID_EMPTY",
    "string.uuid": "PRODUCT_ID_UUID",
    "any.required": "PRODUCT_ID_REQUIRED",
  }),
  quantity: Joi.number().messages({
    "number.base": "QUANTITY_NUMBER",
    "any.required": "QUANTITY_REQUIRED",
  }),
};
