import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing } from '../utils/theme';

export default function PDFViewerScreen({ navigation }) {
  const [rotation, setRotation] = useState(0);

  const rotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <SafeAreaView style={styles.container}>
      {/* Поле PDF (заглушка). Здесь скоро будет отображаться файл */}
      <View style={styles.pdfArea}>
        <Text style={styles.pdfText}>Здесь будет PDF</Text>
      </View>

      {/* Панель инструментов */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.tool}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <Text style={styles.toolIcon}>➕</Text>
          <Text style={styles.toolLabel}>Зум</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tool} activeOpacity={0.8} onPress={rotate}>
          <Text style={styles.toolIcon}>🔄</Text>
          <Text style={styles.toolLabel}>Поворот {rotation > 0 ? `${rotation}°` : ''}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pdfArea: {
    flex: 1,
    margin: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  pdfText: {
    fontSize: 18,
    color: colors.subtitle,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tool: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolLabel: {
    fontSize: 13,
    color: colors.subtitle,
    marginTop: 4,
  },
});