import slugify from "slugify";
import * as dbService from "../../../database/dbService.js";
import { ensureExists, findPaginated } from "../../../database/genericService.js";
import type {
  CreateServiceArgs,
  GetServicesArgs,
  GetServiceByIdArgs,
  UpdateServiceArgs,
  DeleteServiceArgs,
  AddSectionArgs,
  UpdateSectionArgs,
  DeleteSectionArgs,
  AddProjectArgs,
  UpdateProjectArgs,
  DeleteProjectArgs,
} from "./service.validation.js";
import type { AppError } from "../../../Types/error.js";
import { generateSlug } from "../../../Utils/slugs/index.js";

// ─── Service CRUD ─────────────────────────────────────────────────────────────

export const createService = async ({ name, slug, description }: CreateServiceArgs) => {
  const finalSlug = await generateSlug({name: slug, model:"service"}) 
  
  // Check slug uniqueness
  const duplicate = await dbService.findOne({
    model: "service",
    where: { slug: finalSlug },
  });
  if (duplicate) {
    const error = new Error("SLUG_ALREADY_EXISTS") as AppError;
    error.cause = 409;
    throw error;
  }

  return await dbService.create({
    model: "service",
    data: {
      name,
      slug: finalSlug,
      description,
    },
  });
};

export const getServices = async ({ page = 1, limit = 10 }: GetServicesArgs = {}) => {
  return await findPaginated({
    model: "service",
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    orderBy: { createdAt: "desc" },
  });
};

export const getServiceById = async ({ id }: GetServiceByIdArgs) => {
  return await ensureExists({
    model: "service",
    where: { id },
    message: "SERVICE_NOT_FOUND",
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
      projects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

export const updateService = async ({ id, name, slug, description }: UpdateServiceArgs) => {
  const service = (await ensureExists({
    model: "service",
    where: { id },
    message: "SERVICE_NOT_FOUND",
  })) as { name: string; slug: string };

  const updateData: Record<string, unknown> = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;

  if (slug) {
    const finalSlug = slugify(slug, { lower: true, strict: true });
    if (finalSlug !== service.slug) {
      const duplicate = await dbService.findOne({
        model: "service",
        where: { slug: finalSlug },
      });
      if (duplicate) {
        const error = new Error("SLUG_ALREADY_EXISTS") as AppError;
        error.cause = 409;
        throw error;
      }
      updateData.slug = finalSlug;
    }
  } else if (name && name !== service.name) {
    updateData.slug = await generateSlug({name, model:"service"});
  }

  return await dbService.updateOne({
    model: "service",
    where: { id },
    data: updateData,
  });
};

export const deleteService = async ({ id }: DeleteServiceArgs) => {
  await ensureExists({
    model: "service",
    where: { id },
    message: "SERVICE_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "service",
    where: { id },
  });
};

// ─── Sections CRUD ────────────────────────────────────────────────────────────

export const addSection = async ({ serviceId, title, subtitle, type, content, order, img }: AddSectionArgs) => {
  // Check if service exists
  await ensureExists({
    model: "service",
    where: { id: serviceId },
    message: "SERVICE_NOT_FOUND",
  });

  // Content is expected to be a JSON string from form-data. Let's parse it safely.
  let parsedContent: unknown;
  try {
    parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  } catch (err) {
    parsedContent = content;
  }

  return await dbService.create({
    model: "section",
    data: {
      title,
      subtitle,
      type,
      content: parsedContent,
      img: img || null,
      order: order ? Number(order) : 0,
      serviceId,
    },
  });
};

export const updateSection = async ({ sectionId, title, subtitle, type, content, order, img }: UpdateSectionArgs) => {
  // Check if section exists
  await ensureExists({
    model: "section",
    where: { id: sectionId },
    message: "SECTION_NOT_FOUND",
  });

  const updateData: Record<string, unknown> = {};
  if (title) updateData.title = title;
  if (subtitle !== undefined) updateData.subtitle = subtitle;
  if (type) updateData.type = type;
  if (order !== undefined) updateData.order = Number(order);
  if (img) updateData.img = img;

  if (content !== undefined) {
    try {
      updateData.content = typeof content === "string" ? JSON.parse(content) : content;
    } catch (err) {
      updateData.content = content;
    }
  }

  return await dbService.updateOne({
    model: "section",
    where: { id: sectionId },
    data: updateData,
  });
};

export const deleteSection = async ({ sectionId }: DeleteSectionArgs) => {
  await ensureExists({
    model: "section",
    where: { id: sectionId },
    message: "SECTION_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "section",
    where: { id: sectionId },
  });
};

// ─── Projects CRUD ────────────────────────────────────────────────────────────

export const addProject = async ({ serviceId, title, img }: AddProjectArgs) => {
  // Check if service exists
  await ensureExists({
    model: "service",
    where: { id: serviceId },
    message: "SERVICE_NOT_FOUND",
  });

  return await dbService.create({
    model: "project",
    data: {
      title,
      img,
      serviceId,
    },
  });
};

export const updateProject = async ({ projectId, title, img }: UpdateProjectArgs) => {
  // Check if project exists
  await ensureExists({
    model: "project",
    where: { id: projectId },
    message: "PROJECT_NOT_FOUND",
  });

  const updateData: Record<string, unknown> = {};
  if (title) updateData.title = title;
  if (img) updateData.img = img;

  return await dbService.updateOne({
    model: "project",
    where: { id: projectId },
    data: updateData,
  });
};

export const deleteProject = async ({ projectId }: DeleteProjectArgs) => {
  await ensureExists({
    model: "project",
    where: { id: projectId },
    message: "PROJECT_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "project",
    where: { id: projectId },
  });
};
