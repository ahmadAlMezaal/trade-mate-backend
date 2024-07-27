import { Types } from "mongoose";

export type IUserLocation = {
    isoCode: string;
    country: string;
    city: string;
};

export type IUser = {
    _id: Types.ObjectId;
    email: string;
    password: string;
    isVerified: boolean;
    firstName: string;
    lastName: string;
    location: IUserLocation;
    bookmarkedListingIds: string[];
    role: string;
    verificationCode?: number;
    forgotPasswordCode?: number;
    connectionsIds: string[];
    reputation: number;
    profilePhoto: string;
};
