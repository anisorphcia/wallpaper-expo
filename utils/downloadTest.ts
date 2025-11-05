import { downloadOriginalImage, getImageInfo } from './downloadUtils';

/**
 * 测试下载功能
 */
export const testDownload = async (imageId: string = '68956f9fab9725cae3c20859') => {
  try {
    console.log('开始测试下载功能...');
    console.log('测试图片ID:', imageId);
    
    // 获取图片信息
    console.log('获取图片信息...');
    const imageInfo = await getImageInfo(imageId);
    console.log('图片信息:', imageInfo);
    
    if (!imageInfo.exists) {
      console.log('❌ 图片不存在或无法访问');
      return;
    }
    
    console.log('✅ 图片存在，大小:', imageInfo.size, '字节');
    
    // 测试下载
    console.log('开始下载图片...');
    const result = await downloadOriginalImage(imageId, `test_wallpaper_${imageId}.jpg`);
    
    if (result.success) {
      console.log('✅ 下载成功:', result.message);
    } else {
      console.log('❌ 下载失败:', result.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
};

/**
 * 测试多个图片下载
 */
export const testMultipleDownloads = async () => {
  const testIds = [
    '68956f9fab9725cae3c20859',
    '68956f9fab9725cae3c2085a',
    '68956f9fd80c93857435fca0'
  ];
  
  console.log('开始测试多个图片下载...');
  
  for (const id of testIds) {
    console.log(`\n测试下载图片: ${id}`);
    await testDownload(id);
    // 等待一秒再下载下一个
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ 所有测试完成');
};

// 如果直接运行此文件，则执行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中，可以通过控制台调用
  (window as any).testDownload = testDownload;
  (window as any).testMultipleDownloads = testMultipleDownloads;
}
