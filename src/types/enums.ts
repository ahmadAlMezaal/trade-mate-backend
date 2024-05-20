export enum ProductCondition {
    NEW = 'New',
    GOOD = 'Good',
    BAD = 'Bad'
}

export enum ProposalStatus {
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
    PENDING = 'Pending'
}

export enum ListingStatus {
    PENDING = 'Pending',
    OPEN = 'Open',
    REJECTED = 'Rejected',
    APPROVED = 'Approved',
    CLOSED = 'Closed',
    TRADED = 'Traded',
}

export enum DBCollections {
    USERS = 'users',
    LISTINGS = 'listings',
    BOOKS = 'books',
    PROPOSALS = 'proposals',
    NOTIFICATIONS = 'notifications'
}

export enum ConfigVariables {
    MONGODB_URI = 'database.mongodbUri',
}
