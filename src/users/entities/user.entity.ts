
export interface IUser {
    _id: string;
    email: string;
    password: string;
    isVerified: boolean;
    firstName: string;
    lastName: string;
    location: string;
    bookmarkedlistingIds: string[];
    role: string;
    verificationCode?: number;
    forgotPasswordCode?: number;
    connectionsIds: string[];
    reputation: number;
}
