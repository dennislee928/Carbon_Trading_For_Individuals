// types/selector.ts
export interface SelectorByID {
  data_version: string;
  id: string;
  // add other properties as needed
}

export interface SelectorByActivityID {
  activity_id: string;
  // add other properties as needed
}

export type SelectorModel = SelectorByID | SelectorByActivityID;

export interface EmissionParams {
  data_version?: string;
  id?: string;
  activity_id?: string;
  // add other properties as needed
}
