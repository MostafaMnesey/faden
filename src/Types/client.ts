export interface CreateClientArgs {
  name: string;
  logo: string;
  websiteUrl?: string;
  category?: string;
  order?: number;
}

export interface UpdateClientArgs {
  id: string;
  name?: string;
  logo?: string;
  websiteUrl?: string;
  category?: string;
  order?: number;
}

export interface GetClientsArgs {
  page?: unknown;
  limit?: unknown;
  category?: string;
  search?: string;
}

export interface GetClientByIdArgs {
  id: string;
}

export interface DeleteClientArgs {
  id: string;
}
