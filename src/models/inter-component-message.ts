import { MessageTypes } from "./message-types.enum";

export interface InterComponentMessage<T> {
    msgType: MessageTypes | undefined;
    msgData: T | undefined
}
