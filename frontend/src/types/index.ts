import { UserInterface } from "@/context/AuthContext";
export interface PostInterface {
    _id: number;
    title: string;
    content: string;
    createdBy?: UserInterface;
    createdOn: Date;
    createdAt?:Date;
    comments?:CommentInterface[];
    likes?:any[]
}

export interface CommentInterface{
    _id:string;
    comment:string;
    user?:UserInterface;
    createdAt:Date;
    post?:PostInterface;   
}