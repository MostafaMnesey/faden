export interface CreateProjectArgs {
  title: string;
  slug?: string;
  img: string;
  location?: string;
  description?: string;
  client?: string;
  projectType?: string;
  owner?: string;
  consultant?: string;
  scope?: string;
  partnershipType?: string;
  totalArea?: string;
  floors?: string;
  structuralType?: string;
  foundationDepth?: string;
  structuralDetails?: string;
  duration?: string;
  status?: string;
  technicalSpecs?: unknown;
  highlightTitle?: string;
  highlightDescription?: string;
  highlightImg?: string;
  highlights?: string[];
  keyAchievements?: string[];
  images?: string[];
  order?: number;
  serviceId: string;
}

export interface UpdateProjectArgs {
  id: string;
  title?: string;
  slug?: string;
  img?: string;
  location?: string;
  description?: string;
  client?: string;
  projectType?: string;
  owner?: string;
  consultant?: string;
  scope?: string;
  partnershipType?: string;
  totalArea?: string;
  floors?: string;
  structuralType?: string;
  foundationDepth?: string;
  structuralDetails?: string;
  duration?: string;
  status?: string;
  technicalSpecs?: unknown;
  highlightTitle?: string;
  highlightDescription?: string;
  highlightImg?: string;
  highlights?: string[];
  keyAchievements?: string[];
  images?: string[];
  order?: number;
  serviceId?: string;
}

export interface GetProjectsArgs {
  page?: unknown;
  limit?: unknown;
  serviceId?: string;
  serviceIds?: string[];
  partnershipType?: string;
  hasImages?: boolean;
  search?: string;
  sortBy?: "default" | "latest" | "titleAsc" | "titleDesc";
}

export interface GetProjectByIdArgs {
  id: string;
}

export interface GetProjectBySlugArgs {
  slug: string;
}

export interface DeleteProjectArgs {
  id: string;
}
