import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { categoryApi } from '@/constants/endpoints';
import type { Category } from '@/constants/types';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryApi.getCategories();
      setCategories(response.data.res.category);
    } catch (err) {
      setError('获取分类失败，请检查网络连接');
      console.error('获取分类失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    console.log('点击分类:', category.name);
    console.log('分类ID:', category.id);
    console.log('导航路径:', `/category/${category.id}`);

    try {
      router.push(`/category/${category.id}`);
      console.log('导航调用成功');
    } catch (error) {
      console.error('导航失败:', error);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.cover }}
        style={styles.categoryImage}
        contentFit="cover"
      />
      <ThemedView style={styles.categoryInfo}>
        {/* <ThemedText type="subtitle" style={styles.categoryName}>
          {item.name}
        </ThemedText> */}
        <ThemedText style={styles.categoryEname}>
          {item.ename}
        </ThemedText>
        <ThemedText style={styles.categoryCount}>
          {item.count?.toLocaleString() || '0'} 张图片
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>加载分类中...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <ThemedText style={styles.retryButtonText}>重试</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
      </ThemedView>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
        contentContainerStyle={styles.categoryList}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  categoryList: {
    padding: 10,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryItem: {
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
  },
  categoryImage: {
    width: '100%',
    height: 120,
  },
  categoryInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryEname: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
});
