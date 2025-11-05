import { get } from './api'
import type { WallpaperListResponse, WallpaperQueryParams } from './types'



export const categoryApi = {
    getRandomWallpapers: (params?: WallpaperQueryParams) => {
        const queryParams = new URLSearchParams()

        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.adult !== undefined) queryParams.append('adult', params.adult.toString())
        if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
        if (params?.order) queryParams.append('order', params.order)

        const queryString = queryParams.toString()
        const endpoint = `/vertical${queryString ? `?${queryString}` : ""}`;

        return get<WallpaperListResponse>(endpoint)
    }
}