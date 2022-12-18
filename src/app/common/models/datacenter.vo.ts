import { System } from "./system.vo";
import { StorageEntityResponseDto } from "./dtos/storage-entity-response.dto";

export interface Datacenter {
  id: number;
  label: string;
  systems?: System[];
  latitude?: number;
  longitude?: number;
}

export function datacenterOf(dto: StorageEntityResponseDto): Datacenter {
  return {
    id: dto.storageEntity.id,
    label: dto.storageEntity.name,
  };
}
