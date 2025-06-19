export interface TbTableTypes {
  id: number;
  qr_code: string;
  tb_name: string;
}

export interface InstrumentPreviewTypes {
  id: string;
  title: string;
  stringValue: string;
  floatValue: number;
  kks?: string;
  min?: number;
  max?: number;
  sub?: InstrumentPreviewTypes[];
}

export type StorageKeyTypes =
  | 'userToken'
  | 'shift'
  | 'user'
  | 'my-key'
  | 'unitLevel'
  | 'totalUnitArea'
  | 'totalUnitAreaProgres'
  | 'team'
  | 'statusLoad'
  | 'isSubmit'
  | 'lastSync';

export interface UserTypes {
  id: number;
  full_name: string;
  division: string;
}

export interface OptionTypes {
  id: number | string;
  label: string;
  value: string | number;
  id_kks: string | number;
  kks?: string;
}

export type InputTypes = 'checkbox' | 'radio' | 'text' | 'number' | 'dropdown';

export type ShiftTypes = 'Morning' | 'Afternoon' | 'Night';

export interface SubInstrumentTypes {
  id: number | string;
  id_kks: string | number | null;
  identify?: number | null;
  kks?: string;
  max?: number;
  min?: number;
  type: InputTypes;
  options?: OptionTypes[];
}

export interface InstrumentTypes {
  id: number;
  name: string;
  id_kks: number;
  id_ua: number;
  id_pa: number;
  type: InputTypes;
  sub: SubInstrumentTypes[] | null; // Assuming `sub` can be null or a string
  kks: string;
  min: number;
  max: number;
  options: OptionTypes[]; // Assuming `options` is an array of any type
  value?: string;
}

export interface HistoryTypes {
  date: string; // ISO date string
  status: number;
  id_table: number;
  id_row: number;
  plant_area: string;
  id: number;
  pid: string;
  shift: string;
  unit_level: number;
}

export interface SectionTypes {
  data: InstrumentPreviewTypes[];
  note: string;
  emergencyParameter: string;
  title: string;
}
