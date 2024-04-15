import { ConversationStatus } from "../enums/conversation-status.enum";
import { ConversationType } from "../enums/conversation-type.enum";
import { AuditInfo } from "src/models/audit-info";
import { ObjectReference } from "./object-reference";
import { UserMin } from "./user-min";

export interface XnodeConversationBase extends AuditInfo {
    id:string;
    displayId:string;
    title:string;
    description:string;
    followers?:UserMin[];
    owners?:UserMin[];
    contributors?:UserMin[];
    status:ConversationStatus;
    version:number;
    references?:ObjectReference[];
}
