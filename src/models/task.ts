import { AuditInfo } from "./audit-info";
import { FileInfoMin } from "./file-info-min";
import { UserMin } from "./user-min";

export interface Task extends AuditInfo {
    Id: string;
    Priority:string;
    ContentId: string;
    ProductId: string;
    Title:string;
    Description: string;
    Attachments?: FileInfoMin[];
    Status: string;
    Assignee:UserMin;
}
