import { UserMin } from "./user-min";
import { AuditInfo } from "./audit-info";
import { Task } from "./task";

export interface ChangeRequest extends AuditInfo {
    CrId: string;
    Title: string;
    Id: string;
    Status: string;
    Reviewers: UserMin[];
    Items?: Task[]; //DB object will have ItemIds, this is dto object which resolved those ids in API and sent to UI
}