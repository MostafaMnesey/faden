import type { NextFunction } from "express";

export interface CalculateDiscountArgs {
  oldPrice: unknown;
  newPrice: unknown;
}

export interface ProductMedia {
  alt: string;
  src: string;
  role: string;
  type: string;
  isPrimary?: boolean;
}

export interface ProductTranslation {
  title?: string;
  [key: string]: unknown;
}

export interface ProductInput {
  oldPrice: unknown;
  newPrice: unknown;
  discountValue?: number;
  discountPercentage?: number;
  media?: unknown;
  frontImage?: string;
  backImage?: string;
  title?: string;
  translations?: ProductTranslation[];
}

export interface DestructDataArgs {
  body: Record<string, unknown>;
  allowed: string[];
}

export interface CheckArgs {
  model: string;
  where: Record<string, unknown>;
  next: NextFunction;
}

export interface BannerInput {
  id: string;
  image: string;
  targetType: string;
  targetId?: string;
  createdAt: unknown;
}
