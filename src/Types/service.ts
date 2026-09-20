export interface CreateServiceArgs {
  name: string;
  slug?: string;
  description?: string;
}

export interface GetServicesArgs {
  page?: unknown;
  limit?: unknown;
}

export interface GetServiceByIdArgs {
  id: string;
}

export interface UpdateServiceArgs {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface DeleteServiceArgs {
  id: string;
}

export interface AddSectionArgs {
  serviceId: string;
  title: string;
  subtitle?: string;
  type: string;
  content: unknown;
  order?: unknown;
  img?: string;
}

export interface UpdateSectionArgs {
  sectionId: string;
  title?: string;
  subtitle?: string;
  type?: string;
  content?: unknown;
  order?: unknown;
  img?: string;
}

export interface DeleteSectionArgs {
  sectionId: string;
}

export interface AddProjectArgs {
  serviceId: string;
  title: string;
  img: string;
}

export interface UpdateProjectArgs {
  projectId: string;
  title?: string;
  img?: string;
}

export interface DeleteProjectArgs {
  projectId: string;
}

export interface GetServiceBySlugArgs {
  slug: string;
}
