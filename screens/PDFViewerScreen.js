import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { colors, spacing } from '../utils/theme';

export default function PDFViewerScreen({ route }) {
  const file = route?.params?.file;
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Приводим uri к локальному пути (content:// -> файл в кеше)
  const pdfSource = useMemo(() => {
    if (!file?.uri) return null;
    const uri = file.uri;
    if (uri.startsWith('content://')) {
      return { uri, cache: true };
    }
    return { uri };
  }, [file]);

  const rotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.pdfWrap, { transform: [{ rotate: `${rotation}deg` }] }]}>
        {pdfSource ? (
          <Pdf
            source={pdfSource}
            onLoadComplete={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onPageChanged={() => setLoading(false)}
            style={styles.pdf}
            trustAllCerts={false}
            enablePaging
            horizontal
          />
        ) : (
          <View style={styles.pdfArea}>
            <Text style={styles.pdfText}>Файл не выбран</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Загрузка…</Text>
          </View>
        )}

        {error && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.errorText}>Не удалось открыть PDF</Text>
          </View>
        )}
      </View>

      {/* Панель инструментов */}
      <View style={styles.toolbar}>
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
  pdfWrap: {
    flex: 1,
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
  pdf: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: '#D64545',
    fontWeight: '600',
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