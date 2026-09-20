import * as dbService from "../../../database/dbService.js";
import { ensureExists } from "../../../database/genericService.js";

export const getPublicProjects = async (args: {
  page?: unknown;
  limit?: unknown;
  serviceId?: string;
  serviceIds?: string[];
  partnershipType?: string;
  hasImages?: boolean;
  projectsWithoutImages?: boolean;
  search?: string;
  sortBy?: "default" | "latest" | "titleAsc" | "titleDesc";
}) => {
  const where: Record<string, unknown> = {};

  if (args.serviceIds && args.serviceIds.length > 0) {
    where.serviceId = { in: args.serviceIds };
  } else if (args.serviceId) {
    where.serviceId = args.serviceId;
  }

  if (args.partnershipType) {
    where.partnershipType = { equals: args.partnershipType, mode: "insensitive" };
  }

  if (args.hasImages === true) {
    where.img = { not: "" };
  } else if (args.hasImages === false || args.projectsWithoutImages === true) {
    where.OR = [{ img: "" }, { img: null }];
  }

  if (args.search) {
    const searchCondition = [
      { title: { contains: args.search, mode: "insensitive" } },
      { location: { contains: args.search, mode: "insensitive" } },
      { client: { contains: args.search, mode: "insensitive" } },
      { description: { contains: args.search, mode: "insensitive" } },
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchCondition }];
      delete where.OR;
    } else {
      where.OR = searchCondition;
    }
  }

  let orderBy: any = [{ order: "asc" }, { createdAt: "desc" }];
  if (args.sortBy === "latest") {
    orderBy = [{ createdAt: "desc" }];
  } else if (args.sortBy === "titleAsc") {
    orderBy = [{ title: "asc" }];
  } else if (args.sortBy === "titleDesc") {
    orderBy = [{ title: "desc" }];
  }

  return await dbService.findManyWithPaginationAndCount({
    model: "project",
    where,
    page: args.page ? Number(args.page) : 1,
    limit: args.limit ? Number(args.limit) : 9,
    include: {
      service: true,
    },
    orderBy,
  });
};

export const getPublicProjectBySlug = async ({ slug }: { slug: string }) => {
  const project = await ensureExists({
    model: "project",
    where: { slug },
    message: "PROJECT_NOT_FOUND",
    include: {
      service: true,
    },
  });

  const relatedProjects = await dbService.findMany({
    model: "project",
    where: {
      serviceId: project.serviceId,
      id: { not: project.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      service: true,
    },
  });

  return {
    ...project,
    relatedProjects,
  };
};

export const getPublicProjectById = async ({ id }: { id: string }) => {
  const project = await ensureExists({
    model: "project",
    where: { id },
    message: "PROJECT_NOT_FOUND",
    include: {
      service: true,
    },
  });

  const relatedProjects = await dbService.findMany({
    model: "project",
    where: {
      serviceId: project.serviceId,
      id: { not: project.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      service: true,
    },
  });

  return {
    ...project,
    relatedProjects,
  };
};

export const getProjectFilterMetadata = async () => {
  const services = await dbService.findMany({
    model: "service",
    include: {
      _count: {
        select: { projects: true },
      },
    },
  });

  const projects = await dbService.findMany({
    model: "project",
    select: { partnershipType: true },
  });

  const partnershipTypes = Array.from(
    new Set(
      projects
        .map((p: any) => p.partnershipType)
        .filter((pt: any): pt is string => Boolean(pt))
    )
  );

  return {
    categories: services,
    partnershipTypes: partnershipTypes.length > 0 ? partnershipTypes : ["Faden Only", "With Global Energy"],
  };
};
