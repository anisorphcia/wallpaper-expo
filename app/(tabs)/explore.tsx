import { ThemedText } from '@/components/themed-text';
import { ThemedView } from "@/components/themed-view";
import { categoryApi } from '@/constants/endpoints';
import type { Wallpaper, WallpaperQueryParams } from '@/constants/types';
import { downloadOriginalImage } from '@/utils/downloadUtils';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

export default function CategoryDetailScreen() {

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWallpapers(1)
  }, []);

  const fetchWallpapers = async (page = 1, isRefresh = false) => {

    setCurrentPage(page);

    try {
      if (isRefresh) {
        setRefreshing(true);
        setCurrentPage(1);
      } else if (page === 1) {
        setLoading(true);
      }
      setError(null);

      console.log('页码:', page);

      // skip 参数是略过的数量
      // 第1页: skip=0, 第2页: skip=20, 第3页: skip=40, 以此类推
      const skip = (page - 1) * 20;

      const params: WallpaperQueryParams = {
        limit: 20,
        skip: skip,
        order: 'new',
        adult: true,
      };

      console.log('请求参数 - limit:', params.limit, 'skip:', params.skip, 'page:', page, '计算的skip:', skip);

      const response = await categoryApi.getRandomWallpapers(params);

      const newWallpapers = response.data.res.vertical || [];

      // 确保每个壁纸都有有效的ID
      const validWallpapers = newWallpapers.filter(w => w && w.id);
      console.log('有效壁纸数量:', validWallpapers.length);

      if (isRefresh) {
        setWallpapers(validWallpapers);
      } else {
        setWallpapers(prev => {
          if (page === 1) {
            return validWallpapers;
          } else {
            // 确保没有重复的壁纸
            const existingIds = new Set(prev.map(w => w.id));
            const uniqueNewWallpapers = validWallpapers.filter(w => !existingIds.has(w.id));
            return [...prev, ...uniqueNewWallpapers];
          }
        });
      }

      setHasMore(validWallpapers.length === 20);
      setCurrentPage(page);
    } catch (err) {
      setError('获取壁纸失败，请检查网络连接');
      console.error('获取壁纸失败:', err);
    } finally {
      if (page === 1) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWallpaperPress = (wallpaper: Wallpaper) => {
    console.log('点击壁纸:', wallpaper.id);
  };

  const handleRefresh = () => {
    console.log('刷新数据，重置到第1页');
    fetchWallpapers(1, true);
  };

  const handleDownloadPress = async (wallpaper: Wallpaper) => {
    if (downloadingIds.has(wallpaper.id)) {
      return; // 正在下载中，忽略重复点击
    }

    try {
      setDownloadingIds(prev => new Set(prev).add(wallpaper.id));

      console.log('开始下载壁纸:', wallpaper.id);
      const result = await downloadOriginalImage(wallpaper.id);

      if (result.success) {
        Alert.alert('下载成功', result.message);
      } else {
        Alert.alert('下载失败', result.message);
      }
    } catch (error) {
      console.error('下载处理失败:', error);
      Alert.alert('下载失败', '下载过程中发生错误');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(wallpaper.id);
        return newSet;
      });
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      console.log('加载更多，当前页:', currentPage, '下一页:', currentPage + 1);
      fetchWallpapers(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!hasMore) {
      return (
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>没有更多内容了</ThemedText>
        </ThemedView>
      );
    }
    if (loading && currentPage > 1) {
      return (
        <ThemedView style={styles.footer}>
          <ActivityIndicator size="small" />
          <ThemedText style={styles.footerText}>加载中...</ThemedText>
        </ThemedView>
      );
    }
    return null;
  };

  const renderWallpaperItem = ({ item }: { item: Wallpaper }) => {
    if (!item || !item.id) return null;

    const isDownloading = downloadingIds.has(item.id);

    return (
      <ThemedView style={styles.wallpaperItem}>
        <TouchableOpacity
          onPress={() => handleWallpaperPress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.thumb || '' }}
            style={styles.wallpaperImage}
            contentFit="cover"
          />

          <TouchableOpacity
            style={[styles.downloadButton, isDownloading && styles.downloadingButton]}
            onPress={() => handleDownloadPress(item)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.downloadButtonText}>📥</ThemedText>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <ThemedView>
      <ThemedView></ThemedView>
      <FlatList
        data={wallpapers}
        renderItem={renderWallpaperItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.wallpaperRow}
        contentContainerStyle={styles.wallpaperList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 30,
  },
  wallpaperList: {
    padding: 10,
  },
  wallpaperRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wallpaperItem: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative', // 让下载按钮能绝对定位
  },
  wallpaperImage: {
    width: '100%',
    aspectRatio: 0.6, // 宽高比，保证等比显示
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  downloadingButton: {
    backgroundColor: '#999',
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.6,
  },
});

