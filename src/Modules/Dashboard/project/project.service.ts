import slugify from "slugify";
import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";
import { generateSlug } from "../../../Utils/slugs/index.js";
import type { AppError } from "../../../Types/error.js";
import type {
  CreateProjectArgs,
  UpdateProjectArgs,
  GetProjectsArgs,
  GetProjectByIdArgs,
  DeleteProjectArgs,
} from "../../../Types/project.js";

export const createProject = async (args: CreateProjectArgs) => {
  // Ensure Service exists
  await ensureExists({
    model: "service",
    where: { id: args.serviceId },
    message: "SERVICE_NOT_FOUND",
  });

  const finalSlug = args.slug
    ? slugify(args.slug, { lower: true, strict: true })
    : await generateSlug({ name: args.title, model: "project" });

  // Check duplicate slug
  const duplicate = await dbService.findOne({
    model: "project",
    where: { slug: finalSlug },
  });

  if (duplicate) {
    const error = new Error("SLUG_ALREADY_EXISTS") as AppError;
    error.cause = 409;
    throw error;
  }

  return await dbService.create({
    model: "project",
    data: {
      title: args.title,
      slug: finalSlug,
      img: args.img,
      location: args.location,
      description: args.description,
      client: args.client,
      projectType: args.projectType,
      owner: args.owner,
      consultant: args.consultant,
      scope: args.scope,
      partnershipType: args.partnershipType,
      totalArea: args.totalArea,
      floors: args.floors,
      structuralType: args.structuralType,
      foundationDepth: args.foundationDepth,
      structuralDetails: args.structuralDetails,
      duration: args.duration,
      status: args.status,
      technicalSpecs: args.technicalSpecs ?? undefined,
      highlightTitle: args.highlightTitle,
      highlightDescription: args.highlightDescription,
      highlightImg: args.highlightImg,
      highlights: args.highlights ?? [],
      keyAchievements: args.keyAchievements ?? [],
      images: args.images ?? [],
      order: args.order ?? 0,
      serviceId: args.serviceId,
    },
    include: {
      service: true,
    },
  });
};

export const getProjects = async ({
  page = 1,
  limit = 10,
  serviceId,
  partnershipType,
  search,
}: GetProjectsArgs = {}) => {
  const where: Record<string, unknown> = {};

  if (serviceId) {
    where.serviceId = serviceId;
  }

  if (partnershipType) {
    where.partnershipType = { equals: partnershipType, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { client: { contains: search, mode: "insensitive" } },
    ];
  }

  return await dbService.findManyWithPaginationAndCount({
    model: "project",
    where,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    include: {
      service: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const getProjectById = async ({ id }: GetProjectByIdArgs) => {
  return await ensureExists({
    model: "project",
    where: { id },
    message: "PROJECT_NOT_FOUND",
    include: {
      service: true,
    },
  });
};

export const updateProject = async (args: UpdateProjectArgs) => {
  const existingProject = (await ensureExists({
    model: "project",
    where: { id: args.id },
    message: "PROJECT_NOT_FOUND",
  })) as { title: string; slug: string; serviceId: string };

  const updateData: Record<string, unknown> = {};

  if (args.serviceId && args.serviceId !== existingProject.serviceId) {
    await ensureExists({
      model: "service",
      where: { id: args.serviceId },
      message: "SERVICE_NOT_FOUND",
    });
    updateData.serviceId = args.serviceId;
  }

  if (args.title) updateData.title = args.title;
  if (args.img) updateData.img = args.img;
  if (args.location !== undefined) updateData.location = args.location;
  if (args.description !== undefined) updateData.description = args.description;
  if (args.client !== undefined) updateData.client = args.client;
  if (args.projectType !== undefined) updateData.projectType = args.projectType;
  if (args.owner !== undefined) updateData.owner = args.owner;
  if (args.consultant !== undefined) updateData.consultant = args.consultant;
  if (args.scope !== undefined) updateData.scope = args.scope;
  if (args.partnershipType !== undefined) updateData.partnershipType = args.partnershipType;
  if (args.totalArea !== undefined) updateData.totalArea = args.totalArea;
  if (args.floors !== undefined) updateData.floors = args.floors;
  if (args.structuralType !== undefined) updateData.structuralType = args.structuralType;
  if (args.foundationDepth !== undefined) updateData.foundationDepth = args.foundationDepth;
  if (args.structuralDetails !== undefined) updateData.structuralDetails = args.structuralDetails;
  if (args.duration !== undefined) updateData.duration = args.duration;
  if (args.status !== undefined) updateData.status = args.status;
  if (args.technicalSpecs !== undefined) updateData.technicalSpecs = args.technicalSpecs;
  if (args.highlightTitle !== undefined) updateData.highlightTitle = args.highlightTitle;
  if (args.highlightDescription !== undefined) updateData.highlightDescription = args.highlightDescription;
  if (args.highlightImg) updateData.highlightImg = args.highlightImg;
  if (args.highlights !== undefined) updateData.highlights = args.highlights;
  if (args.keyAchievements !== undefined) updateData.keyAchievements = args.keyAchievements;
  if (args.images !== undefined) updateData.images = args.images;
  if (args.order !== undefined) updateData.order = args.order;

  if (args.slug) {
    const finalSlug = slugify(args.slug, { lower: true, strict: true });
    if (finalSlug !== existingProject.slug) {
      const duplicate = await dbService.findOne({
        model: "project",
        where: { slug: finalSlug },
      });
      if (duplicate) {
        const error = new Error("SLUG_ALREADY_EXISTS") as AppError;
        error.cause = 409;
        throw error;
      }
      updateData.slug = finalSlug;
    }
  } else if (args.title && args.title !== existingProject.title) {
    updateData.slug = await generateSlug({ name: args.title, model: "project" });
  }

  return await dbService.updateOne({
    model: "project",
    where: { id: args.id },
    data: updateData,
    include: {
      service: true,
    },
  });
};

export const deleteProject = async ({ id }: DeleteProjectArgs) => {
  await ensureExists({
    model: "project",
    where: { id },
    message: "PROJECT_NOT_FOUND",
  });

  return await dbService.deleteOne({
    model: "project",
    where: { id },
  });
};
