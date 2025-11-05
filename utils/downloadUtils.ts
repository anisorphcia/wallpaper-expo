import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

/**
 * 下载原始图片到相册
 * @param imageId 图片ID
 * @param imageName 图片名称（可选）
 */
export const downloadOriginalImage = async (imageId: string, imageName?: string): Promise<{ success: boolean; message: string }> => {
  try {
    // 请求媒体库权限
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        message: '需要相册权限才能保存图片'
      };
    }

    // 构建下载URL
    const downloadUrl = `http://img5.adesk.com/${imageId}`;
    const fileName = imageName || `wallpaper_${imageId}.jpg`;

    // 获取下载目录
    const downloadDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    console.log('documentDirectory:', FileSystem.documentDirectory);
    console.log('cacheDirectory:', FileSystem.cacheDirectory);
    if (!downloadDir) {
      return {
        success: false,
        message: '无法获取下载目录'
      };
    }

    const fileUri = `${downloadDir}${fileName}`;

    console.log('开始下载图片:', downloadUrl);
    console.log('保存路径:', fileUri);

    // 下载文件
    const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);

    if (downloadResult.status !== 200) {
      return {
        success: false,
        message: `下载失败，状态码: ${downloadResult.status}`
      };
    }

    console.log('下载完成，文件大小:', downloadResult.headers['content-length']);

    // 保存到相册
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('Wallpapers', asset, false);

    // 清理临时文件
    await FileSystem.deleteAsync(fileUri, { idempotent: true });

    return {
      success: true,
      message: '图片已保存到相册'
    };

  } catch (error) {
    console.error('下载图片失败:', error);
    return {
      success: false,
      message: `下载失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 检查下载状态
 * @param imageId 图片ID
 */
export const checkDownloadStatus = async (imageId: string): Promise<boolean> => {
  try {
    const fileName = `wallpaper_${imageId}.jpg`;
    const downloadDir = FileSystem.documentDirectory;
    if (!downloadDir) return false;

    const fileUri = `${downloadDir}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    return fileInfo.exists;
  } catch (error) {
    console.error('检查下载状态失败:', error);
    return false;
  }
};

/**
 * 获取图片信息
 * @param imageId 图片ID
 */
export const getImageInfo = async (imageId: string) => {
  try {
    const downloadUrl = `http://img5.adesk.com/${imageId}`;
    const response = await fetch(downloadUrl, { method: 'HEAD' });

    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');

      return {
        exists: true,
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType || 'image/jpeg'
      };
    }

    return { exists: false };
  } catch (error) {
    console.error('获取图片信息失败:', error);
    return { exists: false };
  }
};
