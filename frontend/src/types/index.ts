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