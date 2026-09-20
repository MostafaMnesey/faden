export interface CreateGalleryArgs {
  title?: string;
  img: string;
  description?: string;
  order?: number;
}

export interface GetGalleryItemsArgs {
  page?: unknown;
  limit?: unknown;
}

export interface GetGalleryItemByIdArgs {
  id: string;
}

export interface UpdateGalleryArgs {
  id: string;
  title?: string;
  img?: string;
  description?: string;
  order?: number;
}

export interface DeleteGalleryArgs {
  id: string;
}
