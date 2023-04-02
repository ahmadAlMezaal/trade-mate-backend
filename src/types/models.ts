import { Stream } from 'stream';

export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}

interface VolumInfo {
    title: string;
    subtitle?: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description?: string;
    industryIdentifiers: {
        type: string;
        identifier: string;
    };
    pageCount: number;
    readingModes: {
        text: boolean;
        image: boolean;
        printType: string
    };
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string
    panelizationSummary: {
        containsEpubBubbles: boolean
        containsImageBubbles: boolean
    };
    imageLinks: {
        smallThumbnail?: string;
        thumbnail?: string
    }
    language: string
    previewLink: string
    infoLink: string
    canonicalVolumeLink: string
}

export interface IGoogleBook {
    kind: string;
    id: string;
    etag: string;
    selfLink: string
    volumeInfo: VolumInfo;
    saleInfo: {
        country: string;
        saleability: string;
        isEbook: boolean;
    };
    accessInfo: {
        country: string;
        viewability: string;
        embeddable: boolean;
        publicDomain: boolean;
    };
    textToSpeechPermission: string;
    epub: {
        isAvailable: boolean;
    };
    pdf: {
        isAvailable: boolean;
        acsTokenLink?: string;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
    searchInfo: {
        textSnippet: string;
    };
}

export interface IBook {
    providerId: string;
    title: string;
    subtitle: string;
    authors: string[];
    description: string;
    imageUrls: string[];
    totalPageCount: number
    genres: string[];
    language: string;
    pdfLink: string;
}