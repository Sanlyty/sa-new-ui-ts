export class StorageEntityDetailResponseDto {
  name: string;
  serialNumber: string;
  arrayModel: string;
  dkc: string;
  managementIp: string;
  rack: string;
  prefixReferenceId: string;
  room: string;
  sortId: number;
  speed: number;
  note: string;
  cables: string;
  switch: string;
  slot: string;
  covers?: string;
  san_env?: string;
  automation?: boolean;
  throughput?: number;
  wwn: string;
}
