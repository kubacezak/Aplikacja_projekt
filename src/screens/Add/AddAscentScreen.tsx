import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import type { AppTabParamList } from '../../navigation/types';

type AddTabRouteProp = RouteProp<AppTabParamList, 'Add'>;

type StyleOption = 'flash' | 'onsight' | 'rp' | 'tr';

export const AddAscentScreen = () => {
  const route = useRoute<AddTabRouteProp>();
  const navigation = useNavigation<NavigationProp<AppTabParamList>>();
  const { user } = useAuth();

  const [style, setStyle] = useState<StyleOption>('flash');
  const [attempts, setAttempts] = useState('1');
  const [sent, setSent] = useState(true);
  const [climbedAt, setClimbedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  const routeId = route.params?.routeId;
  const routeName = route.params?.routeName;

  const styleOptions: StyleOption[] = useMemo(() => ['flash', 'onsight', 'rp', 'tr'], []);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to log an ascent.');
      return;
    }

    if (!routeId) {
      Alert.alert('Select a route', 'Open a route from the Home tab to log an ascent.');
      return;
    }

    const parsedAttempts = Number(attempts) || 1;
    const parsedRating = rating ? Number(rating) : null;

    setLoading(true);
    const { error } = await supabase.from('ascents').insert({
      user_id: user.id,
      route_id: routeId,
      style,
      attempts: parsedAttempts,
      sent,
      climbed_at: climbedAt,
      rating: parsedRating
    });

    setLoading(false);

    if (error) {
      console.error('Failed to log ascent', error);
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Ascent saved!');
    setAttempts('1');
    setSent(true);
    setClimbedAt(new Date().toISOString().slice(0, 10));
    setRating('');
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log an ascent</Text>
      {routeId ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Route</Text>
          <Text style={styles.infoValue}>{routeName ?? 'Selected route'}</Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>Select a route from the Home tab to prefill this screen.</Text>
      )}

      <Text style={styles.sectionLabel}>Style</Text>
      <View style={styles.row}>
        {styleOptions.map((option) => (
          <Text
            key={option}
            style={[styles.chip, style === option && styles.chipSelected]}
            onPress={() => setStyle(option)}
          >
            {option.toUpperCase()}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Attempts</Text>
      <TextInput
        value={attempts}
        onChangeText={setAttempts}
        keyboardType="number-pad"
        style={styles.input}
        placeholder="1"
      />

      <View style={styles.switchRow}>
        <Text style={styles.sectionLabel}>Sent?</Text>
        <Switch value={sent} onValueChange={setSent} />
      </View>

      <Text style={styles.sectionLabel}>Climbed on (YYYY-MM-DD)</Text>
      <TextInput value={climbedAt} onChangeText={setClimbedAt} style={styles.input} placeholder="2024-01-01" />

      <Text style={styles.sectionLabel}>Rating (1-5, optional)</Text>
      <TextInput value={rating} onChangeText={setRating} keyboardType="number-pad" style={styles.input} placeholder="" />

      <Button title={loading ? 'Saving...' : 'Save ascent'} onPress={handleSubmit} disabled={loading || !routeId} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f7',
    marginBottom: 16
  },
  infoLabel: {
    fontSize: 12,
    color: '#666'
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600'
  },
  placeholderText: {
    marginBottom: 16,
    color: '#555'
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    marginRight: 8
  },
  chipSelected: {
    backgroundColor: '#007AFF33',
    borderColor: '#007AFF',
    color: '#007AFF'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  }
});
