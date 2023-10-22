import { UserMin } from "./user-min";
import { AuditInfo } from "./audit-info";
import { FileInfoMin } from "./file-info-min";

export interface Comment extends AuditInfo {
    Id: string;
    ContentId?: string; // for CR Comment it can be null
    ProductId?: string; // for CR Comment it can be null
    Message: string;
    CrId?: string; // when this comment relates to CR
    LinkedCommentIds: string[]; // Replies to this comment
    Attachments: FileInfoMin[];
    UserMentions: UserMin[];
    ItemType: string; // Comment / CR Comment
    Status: string; // for CR comments to confirm if resolved
}
