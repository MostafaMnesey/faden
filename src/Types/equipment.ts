export interface CreateEquipmentArgs {
  name: string;
  count?: number;
  img: string;
  category?: string;
  order?: number;
}

export interface UpdateEquipmentArgs {
  id: string;
  name?: string;
  count?: number;
  img?: string;
  category?: string;
  order?: number;
}

export interface GetEquipmentArgs {
  page?: unknown;
  limit?: unknown;
  category?: string;
  search?: string;
}

export interface GetEquipmentByIdArgs {
  id: string;
}

export interface DeleteEquipmentArgs {
  id: string;
}
