import { ConversationType } from "../enums/conversation-type.enum";
import { XnodeConversationBase } from "./xnode-conversation-base";

export interface XnodeConversation extends XnodeConversationBase {
    productId:string;
    conversationType:ConversationType;
    title:string;
    source:string;
    data?: string;
}
