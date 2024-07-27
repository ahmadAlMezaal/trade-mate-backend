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

export enum ConfigVariables {
    MONGODB_URI = 'database.mongodbUri',
    AWS_REGION = 'aws.region',
    AWS_KEY_ID = 'aws.keyId',
    AWS_SECRET = 'aws.secret',
    AWS_BUCKET_NAME = 'aws.bucketName',
}
