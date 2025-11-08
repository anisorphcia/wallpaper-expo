// 分类相关类型定义
export interface Category {
  id: string;
  name: string;
  rname: string;
  ename: string;
  count: number;
  cover: string;
  cover_temp: string;
  icover: string;
  picasso_cover: string;
  rank: number;
  sn: number;
  type: number;
  atime: number;
  filter: any[];
}

export interface CategoryListResponse {
  msg: string;
  res: {
    category: Category[];
  };
  code: number;
}

// 壁纸相关类型定义
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

export interface WallpaperListResponse {
  msg: string;
  res: {
    vertical: Wallpaper[];
  };
  code: number;
}

// 查询参数类型定义
export interface WallpaperQueryParams {
  limit?: number;       // 每页数量，默认30
  adult?: boolean;      // 是否包含成人内容，默认true
  skip?: number;        // 略过的数量，用于分页
  order?: 'new' | 'hot' | 'rank'; // 排序方式：new-最新，hot-最热，rank-排名
}

// 通用响应类型
export interface ApiResponse<T = any> {
  msg: string;
  res: T;
  code: number;
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 搜索参数类型
export interface SearchParams {
  keyword?: string;
  tags?: string[];
  category?: string;
}

// 排序参数类型
export interface SortParams {
  order?: 'asc' | 'desc';
  sortBy?: string;
}
