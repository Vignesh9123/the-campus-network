import { UserInterface } from "@/context/AuthContext";
export interface PostInterface {
    _id: string;
    title: string;
    content: string;
    createdBy?: UserInterface;
    createdOn: Date;
    createdAt?:Date;
    comments?:CommentInterface[];
    likes?:string[];
    isRepost?:boolean;
    repostedPost?:PostInterface;
    repostedBy?: string[];
    repostedFrom?:UserInterface;
}

export interface CommentInterface{
    _id:string;
    comment:string;
    user?:UserInterface;
    createdAt:Date;
    post?:PostInterface;   
}

export interface ChatInterface{
    _id:string;
    lastMessage?:string;
    lastMessageDetails?:ChatMessageInterface[];
    participants:UserInterface[];
    createdAt:Date;
    updatedAt?:Date;
    admin:string;
    chatType:"one2one"|"group";
    isGroupChat?:boolean

}

export interface ChatMessageInterface{
    _id:string;
    sender:UserInterface
    content:string;
    chat:string;
    createdAt:Date;
}