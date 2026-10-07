import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing } from '../utils/theme';
import PrimaryButton from '../components/PrimaryButton';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Rider</Text>
        <Text style={styles.subtitle}>Список недавних файлов</Text>
      </View>

      {/* Заглушка списка файлов — скоро здесь будут недавние PDF */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyText}>Нет недавних файлов</Text>
        <Text style={styles.emptyHint}>
          Импортируйте первый файл, чтобы он появился здесь
        </Text>
      </View>

      <PrimaryButton
        title="Импортировать файл"
        onPress={() => navigation.navigate('PDFViewer')}
      />
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
    marginBottom: spacing.xl,
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
});