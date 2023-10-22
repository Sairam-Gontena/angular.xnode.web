import { UserMin } from "./user-min";

export interface AuditInfo {
    CreatedBy: UserMin;
    CreatedOn: Date;
    ModifiedBy?: UserMin;
    ModifiedOn?: Date;
}
