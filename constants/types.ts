export interface Wallpaper {
    id: string;
    views: number;
    ncos: number;
    rank: number;
    source_type: string;
    tag: string[];
    wp: string;           // 壁纸原图URL
    xr: boolean;
    cr: boolean;
    favs: number;
    atime: number;
    desc: string;
    thumb: string;        // 缩略图URL
    img: string;          // 高清图URL
    cid: string[];        // 分类ID数组
    url: string[];
    rule: string;
    preview: string;      // 预览图URL
    store: string;
}

export interface WallpaperQueryParams {
    limit?: number;       // 每页数量，默认30
    adult?: boolean;      // 是否包含成人内容，默认true
    skip?: number;        // 略过的数量，用于分页
    order?: 'new' | 'hot' | 'rank'; // 排序方式：new-最新，hot-最热，rank-排名
}

export interface WallpaperListResponse {
    msg: string;
    res: {
        vertical: Wallpaper[];
    };
    code: number;
}      
