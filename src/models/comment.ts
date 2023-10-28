import { UserMin } from "./user-min";
import { AuditInfo } from "./audit-info";
import { FileInfoMin } from "./file-info-min";
import { Section } from "./section";

export interface Comment extends AuditInfo {
    id: string;
    content_id?: string; // for CR Comment it can be null
    product_id?: string; // for CR Comment it can be null
    content?: Section;
    user_id: string;
    message: string;
    crId?: string; // when this comment relates to CR
    linkedCommentIds: string[]; // Replies to this comment
    attachments: FileInfoMin[];
    userMentions: UserMin[];
    itemType: string; // Comment / CR Comment
    status: string; // for CR comments to confirm if resolved
}
