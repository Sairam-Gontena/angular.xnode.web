export interface SpecVersion {
  id: string;
  productId: string;
  major: number;
  minor: number;
  build: number;
  tag?: string | null;
  version: string;
  notes?: string | null;
  createdBy: any;
  createdOn: string;
  modifiedBy: any;
  modifiedOn: string;
  specStatus: string;
  label?: string;
  value?: string;
}
