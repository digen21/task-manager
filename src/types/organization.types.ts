import { Organizations } from "@entity";

export type UpdateOrganizationsInput = Partial<Omit<Organizations, "id">>;
export type GetByOrganizationsInput = Partial<Organizations>;
