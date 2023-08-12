
export interface IUser {
    _id: string;
    email: string;
    password: string;
    isVerified: boolean;
    firstName: string;
    lastName: string;
    location: string;
    bookmarkedListingIds: string[];
    role: string;
    verificationCode?: number;
    forgotPasswordCode?: number;
}
