import { z } from "zod";
import { RequestHandler } from "express";

export interface ValidationSchema {
  body?: z.ZodObject<z.ZodRawShape>;
  query?: z.ZodObject<z.ZodRawShape>;
  params?: z.ZodObject<z.ZodRawShape>;
  headers?: z.ZodObject<z.ZodRawShape>;
}

export interface ValidationRequestHandler extends RequestHandler {
  schema?: ValidationSchema;
}
