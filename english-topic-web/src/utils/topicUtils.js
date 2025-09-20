// Helper function để import tất cả file JSON từ thư mục data
export const importAllTopics = () => {
  const topicModules = import.meta.glob('../data/*.json');
  
  return Object.keys(topicModules).map(path => {
    const topicName = path.replace('../data/', '').replace('.json', '');
    return topicName;
  });
};

// Helper function để lấy dữ liệu của một topic cụ thể
export const getTopicData = async (topicName) => {
  try {
    const module = await import(`../data/${topicName}.json`);
    return module.default || module;
  } catch (error) {
    console.error(`Error loading topic ${topicName}:`, error);
    return null;
  }
};

// Helper function để lấy số lượng từ vựng trong một topic
export const getTopicWordCount = async (topicName) => {
  try {
    const data = await getTopicData(topicName);
    if (data && Array.isArray(data)) {
      return data.length;
    }
    return 0;
  } catch (error) {
    console.error(`Error counting words for topic ${topicName}:`, error);
    return 0;
  }
};

// Metadata cho các topics
export const getTopicMetadata = () => ({
  'Act': { icon: '🎭', description: 'Từ vựng về hành động', category: 'Action' },
  'Animal': { icon: '🐾', description: 'Từ vựng về động vật', category: 'Nature' },
  'Appearance': { icon: '👤', description: 'Từ vựng về ngoại hình', category: 'Person' },
  'Bank': { icon: '🏦', description: 'Từ vựng về ngân hàng', category: 'Business' },
  'character': { icon: '😊', description: 'Từ vựng về tính cách', category: 'Person' },
  'Christmas': { icon: '🎄', description: 'Từ vựng về Giáng sinh', category: 'Holiday' },
  'Clothes': { icon: '👕', description: 'Từ vựng về quần áo', category: 'Fashion' },
  'Color': { icon: '🌈', description: 'Từ vựng về màu sắc', category: 'Basic' },
  'Count': { icon: '🔢', description: 'Từ vựng về số đếm', category: 'Basic' },
  'Country': { icon: '🌍', description: 'Từ vựng về quốc gia', category: 'Geography' },
  'Daily-Activities': { icon: '📅', description: 'Hoạt động hàng ngày', category: 'Activity' },
  'Drink': { icon: '🥤', description: 'Từ vựng về đồ uống', category: 'Food' },
  'Environment': { icon: '🌱', description: 'Từ vựng về môi trường', category: 'Nature' },
  'Family': { icon: '👨‍👩‍👧‍👦', description: 'Từ vựng về gia đình', category: 'Person' },
  'Fashion': { icon: '👗', description: 'Từ vựng về thời trang', category: 'Fashion' },
  'Flower': { icon: '🌸', description: 'Từ vựng về hoa', category: 'Nature' },
  'Food': { icon: '🍕', description: 'Từ vựng về thức ăn', category: 'Food' },
  'Football': { icon: '⚽', description: 'Từ vựng về bóng đá', category: 'Sport' },
  'Fruit': { icon: '🍎', description: 'Từ vựng về trái cây', category: 'Food' },
  'Happy': { icon: '😄', description: 'Từ vựng về cảm xúc vui', category: 'Emotion' },
  'Health': { icon: '🏥', description: 'Từ vựng về sức khỏe', category: 'Health' },
  'Hometown': { icon: '🏘️', description: 'Từ vựng về quê hương', category: 'Geography' },
  'Hospital': { icon: '🏥', description: 'Từ vựng về bệnh viện', category: 'Health' },
  'Insect': { icon: '🐛', description: 'Từ vựng về côn trùng', category: 'Nature' },
  'Job': { icon: '💼', description: 'Từ vựng về nghề nghiệp', category: 'Work' },
  'Kitchen': { icon: '🍳', description: 'Từ vựng về nhà bếp', category: 'Home' },
  'Lunar-New-Yea': { icon: '🏮', description: 'Từ vựng về Tết Nguyên Đán', category: 'Holiday' },
  'Mid-Autumn Festival': { icon: '🌕', description: 'Từ vựng về Tết Trung Thu', category: 'Holiday' },
  'Military': { icon: '🪖', description: 'Từ vựng về quân sự', category: 'Military' },
  'Movie': { icon: '🎬', description: 'Từ vựng về phim ảnh', category: 'Entertainment' },
  'Post-office': { icon: '📮', description: 'Từ vựng về bưu điện', category: 'Service' },
  'School': { icon: '🏫', description: 'Từ vựng về trường học', category: 'Education' },
  'Seafood': { icon: '🦐', description: 'Từ vựng về hải sản', category: 'Food' },
  'Shopping': { icon: '🛒', description: 'Từ vựng về mua sắm', category: 'Shopping' },
  'Sport': { icon: '🏃', description: 'Từ vựng về thể thao', category: 'Sport' },
  'Store': { icon: '🏪', description: 'Từ vựng về cửa hàng', category: 'Shopping' },
  'Study': { icon: '📚', description: 'Từ vựng về học tập', category: 'Education' },
  'Traffic': { icon: '🚦', description: 'Từ vựng về giao thông', category: 'Transport' },
  'Travel': { icon: '✈️', description: 'Từ vựng về du lịch', category: 'Travel' },
  'Vegetable': { icon: '🥬', description: 'Từ vựng về rau củ', category: 'Food' },
  'Weather': { icon: '🌤️', description: 'Từ vựng về thời tiết', category: 'Nature' },
  'Work': { icon: '💼', description: 'Từ vựng về công việc', category: 'Work' }
});