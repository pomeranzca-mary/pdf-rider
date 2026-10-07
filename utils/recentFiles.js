import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pdf_rider_recent_files';

// Храним список недавно открытых файлов
export async function getRecentFiles() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function addRecentFile(file) {
  try {
    const current = await getRecentFiles();
    // Убираем дубликат с тем же uri
    const filtered = current.filter((f) => f.uri !== file.uri);
    const updated = [file, ...filtered].slice(0, 10); // максимум 10
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return current;
  }
}