import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../utils/theme';
import PrimaryButton from '../components/PrimaryButton';
import { getRecentFiles, addRecentFile } from '../utils/recentFiles';

export default function HomeScreen({ navigation }) {
  const [recentFiles, setRecentFiles] = useState([]);

  // Загружаем список недавних при каждом фокусе экрана
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getRecentFiles().then((files) => {
        if (active) setRecentFiles(files);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // только PDF-файлы
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return; // пользователь отменил выбор
      }

      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.name || 'Документ',
        size: asset.size || 0,
        date: new Date().toISOString(),
      };

      await addRecentFile(file);
      setRecentFiles(await getRecentFiles());

      // Переходим к просмотру выбранного файла
      navigation.navigate('PDFViewer', { file });
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось открыть файл. Попробуйте ещё раз.');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fileItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('PDFViewer', { file: item })}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>PDF</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.size ? (
          <Text style={styles.fileMeta}>{formatSize(item.size)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Rider</Text>
        <Text style={styles.subtitle}>Недавние файлы</Text>
      </View>

      {recentFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>Нет недавних файлов</Text>
          <Text style={styles.emptyHint}>
            Нажмите кнопку ниже, чтобы добавить первый PDF
          </Text>
        </View>
      ) : (
        <FlatList
          data={recentFiles}
          keyExtractor={(item, index) => item.uri || String(index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.buttonWrap}>
        <PrimaryButton title="Импортировать файл" onPress={pickDocument} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtitle,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyHint: {
    fontSize: 14,
    color: colors.subtitle,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F7F7F9',
    marginBottom: 8,
  },
  fileIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileIconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  fileMeta: {
    fontSize: 13,
    color: colors.subtitle,
    marginTop: 2,
  },
  buttonWrap: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});