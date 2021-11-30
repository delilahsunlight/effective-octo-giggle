
export interface QueryResult {
    images: Image[];
    interactions: unknown[];
    total: number;
}

export interface Image {
    animated: boolean;
    aspect_ratio: number;
    comment_count: number;
    created_at: string;
    deletion_reason: null;
    description: string;
    downvotes: number;
    duplicate_of: null;
    duration: number;
    faves: number;
    first_seen_at: string;
    format: string;
    height: number;
    hidden_from_users: boolean;
    id: number;
    intensities: Intensities;

    mime_type: string;
    name: string;
    orig_sha512_hash: string;
    processed: boolean;
    representations: Representations
    sha512_hash: string;
    size: number;
    source_url: string;
    spoilered: boolean;
    tag_count: number;

    tag_ids: number[];
    tags: string[];

    thumbnails_generated: boolean;
    updated_at: string;
    uploader: string;
    uploader_id: number;
    upvotes: number
    view_url: string;
    width: number;
    wilson_score: number;
}

interface Intensities {
    ne: number;
    nw: number;
    se: number;
    sw: number;
}

interface Representations {
    full: string;
    large: string;
    medium: string;
    small: string;
    tall: string;
    thumb: string;
    thumb_small: string;
    thumb_tiny: string;
}

export interface WebHookData {
    avatar_url?: string;
    username?: string;
    content?: string;
    embeds?: Embed[];
    tts?: boolean;
    attachments?: Attachment[];
}

export interface Embed {
    title?: string;
    type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
    description?: string;
    url?: string;
    timestamp?: number;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedThumbnail;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];
}

export interface EmbedFooter {
     text: string;
     icon_url?: string;
     proxy_icon_url?: string;
}

export interface EmbedField {
    name: string;
    value: string;
    incline?: boolean;
}

export interface EmbedImage {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export interface EmbedThumbnail {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export interface EmbedAuthor {
    name: string;
    url?: string;
    icon_url: string;
    proxy_icon_url: string;
}

export interface EmbedProvider {
    name?: string;
    url?: string;
}

export interface EmbedVideo {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}


export interface Attachment {
    id?: string | number;
    filename?: string;
    description?: string;
    content_type?: string;
    size?: number;
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
    ephemeral?: number;
}