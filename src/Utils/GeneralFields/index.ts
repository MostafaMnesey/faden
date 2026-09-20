import { z } from "zod";

// ─── Helper: build a required_error/invalid_type_error message via z.string() ──
// In Zod v4, error messages use the `error` param with a callback or `message`
const str = (requiredMsg: string, typeMsg: string) =>
  z.string({ error: (iss) => (iss.input === undefined ? requiredMsg : typeMsg) });

export const generalFeilds = {
  role_name: str("ROLE_NAME_REQUIRED", "ROLE_NAME_STRING")
    .min(3, "ROLE_NAME_MIN")
    .max(15, "ROLE_NAME_MAX"),

  url: z.string().url(),
  page: z.coerce.number(),
  limit: z.coerce.number(),

  name: str("NAME_REQUIRED", "NAME_STRING")
    .min(3, "NAME_MIN")
    .max(32, "NAME_MAX"),

  email: str("EMAIL_REQUIRED", "EMAIL_STRING")
    .email("EMAIL_INVALID"),

  address: str("ADDRESS_REQUIRED", "ADDRESS_STRING")
    .min(3, "ADDRESS_MIN")
    .max(100, "ADDRESS_MAX"),

  codeCountry: str("CODE_COUNTRY_REQUIRED", "CODE_COUNTRY_STRING"),

  password: str("PASSWORD_REQUIRED", "PASSWORD_STRING")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/,
      "PASSWORD_PATTERN",
    ),

  gender: z.enum(["male", "female"] as const, {
    error: (iss) => (iss.input === undefined ? "GENDER_REQUIRED" : "GENDER_ONLY"),
  }),

  birth_date: str("BIRTH_DATE_REQUIRED", "BIRTH_DATE_STRING")
    .datetime({ message: "BIRTH_DATE_FORMAT" }),

  date: z.string().datetime().optional(),

  country: str("COUNTRY_REQUIRED", "COUNTRY_STRING"),

  phone: str("PHONE_REQUIRED", "PHONE_STRING")
    .regex(/^(?:\+20|0020|0)?1[0125][0-9]{8}$/, "PHONE_PATTERN"),

  idToken: str("ID_TOKEN_REQUIRED", "ID_TOKEN_STRING"),

  provider: z.enum(["google", "local"] as const, {
    error: (iss) => (iss.input === undefined ? "PROVIDER_REQUIRED" : "PROVIDER_ONLY"),
  }),

  otp: str("OTP_REQUIRED", "OTP_STRING")
    .length(6, "OTP_LENGTH")
    .regex(/^[0-9]{6}$/, "OTP_PATTERN"),

  file: z.object({
    fieldname: str("FILE_FIELDNAME_REQUIRED", "FILE_FIELDNAME_STRING"),
    originalname: str("FILE_ORIGINALNAME_REQUIRED", "FILE_ORIGINALNAME_STRING"),
    encoding: str("FILE_ENCODING_REQUIRED", "FILE_ENCODING_STRING"),
    mimetype: str("FILE_MIMETYPE_REQUIRED", "FILE_MIMETYPE_STRING"),
    finalPath: str("FILE_FINALPATH_REQUIRED", "FILE_FINALPATH_STRING"),
    destination: str("FILE_DESTINATION_REQUIRED", "FILE_DESTINATION_STRING"),
    filename: str("FILE_FILENAME_REQUIRED", "FILE_FILENAME_STRING"),
    path: str("FILE_PATH_REQUIRED", "FILE_PATH_STRING"),
    size: z
      .number({ error: (iss) => (iss.input === undefined ? "FILE_SIZE_REQUIRED" : "FILE_SIZE_NUMBER") })
      .positive("FILE_SIZE_POSITIVE"),
  }),

  id: str("ID_REQUIRED", "ID_STRING")
    .uuid("ID_INVALID"),

  deviceId: z.string({ error: "DEVICE_ID_STRING" }).optional(),

  productId: str("PRODUCT_ID_REQUIRED", "PRODUCT_ID_STRING")
    .uuid("PRODUCT_ID_UUID"),

  quantity: z.number({
    error: (iss) => (iss.input === undefined ? "QUANTITY_REQUIRED" : "QUANTITY_NUMBER"),
  }),

  slug: str("SLUG_REQUIRED", "SLUG_STRING")
    .min(3, "SLUG_MIN")
    .max(100, "SLUG_MAX")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "SLUG_PATTERN_INVALID"),

  description: z.string({ error: "DESCRIPTION_STRING" })
    .max(1000, "DESCRIPTION_MAX")
    .optional(),

  title: str("TITLE_REQUIRED", "TITLE_STRING")
    .min(2, "TITLE_MIN")
    .max(150, "TITLE_MAX"),

  subtitle: z.string({ error: "SUBTITLE_STRING" })
    .max(300, "SUBTITLE_MAX")
    .optional(),

  order: z
    .number({ error: "ORDER_NUMBER" })
    .int("ORDER_INTEGER")
    .min(0, "ORDER_MIN")
    .optional(),
};
