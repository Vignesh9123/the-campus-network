export interface PostInterface {
    _id: number;
    title: string;
    content: string;
    createdBy:{
        _id: number;
        username: string;
        email: string;
    };
    createdOn: Date;
}