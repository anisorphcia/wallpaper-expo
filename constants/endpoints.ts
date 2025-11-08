import { get } from "./api";
import type {
    Category,
    CategoryListResponse,
    WallpaperListResponse,
    WallpaperQueryParams,
} from "./types";

// Category 相关接口
export const categoryApi = {
    /**
     * 获取分类列表
     * 根据实际 API 响应：https://service.picasso.adesk.com/v1/vertical/category
     */
    getCategories: () => {
        return get<CategoryListResponse>("/category");
    },

    /**
     * 获取单个分类详情
     * @param id 分类ID
     */
    getCategory: (id: string) => {
        return get<Category>(`/category/${id}`);
    },

    /**
     * 获取分类下的壁纸列表
     * @param categoryId 分类ID
     * @param params 查询参数
     * 根据实际 API：http://service.picasso.adesk.com/v1/vertical/category/{categoryId}/vertical
     */
    getCategoryWallpapers: (
        categoryId: string,
        params?: WallpaperQueryParams
    ) => {
        const queryParams = new URLSearchParams();

        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.adult !== undefined)
            queryParams.append("adult", params.adult.toString());
        if (params?.skip !== undefined)
            queryParams.append("skip", params.skip.toString());
        if (params?.order) queryParams.append("order", params.order);

        const queryString = queryParams.toString();
        const endpoint = `/category/${categoryId}/vertical${queryString ? `?${queryString}` : ""
            }`;

        return get<WallpaperListResponse>(endpoint);
    },
    getRandomWallpapers: (params?: WallpaperQueryParams) => {
        const queryParams = new URLSearchParams();

        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.adult !== undefined)
            queryParams.append("adult", params.adult.toString());
        if (params?.skip !== undefined)
            queryParams.append("skip", params.skip.toString());
        if (params?.order) queryParams.append("order", params.order);

        const queryString = queryParams.toString();
        const endpoint = `/vertical${queryString ? `?${queryString}` : ""
            }`;

        return get<WallpaperListResponse>(endpoint);
    },
};

// 导出所有接口
export default {
    category: categoryApi,
};

// 重新导出类型，方便使用
export type {
    Category,
    CategoryListResponse,
    Wallpaper,
    WallpaperListResponse,
    WallpaperQueryParams
} from "./types";

