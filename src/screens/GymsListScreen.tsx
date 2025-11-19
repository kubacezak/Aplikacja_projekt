import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { supabase } from '../../supabaseClient';
import type { HomeStackParamList } from '../navigation/types';

type GymsListScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'GymsList'>;

type Gym = {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
};

export const GymsListScreen = () => {
  const navigation = useNavigation<GymsListScreenNavigationProp>();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGyms = useCallback(async () => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from<Gym>('gyms')
        .select('id, name, city, address')
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setGyms(data ?? []);
    } catch (err) {
      console.error('Failed to fetch gyms', err);
      setError('Failed to load gyms. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGyms();
  }, [fetchGyms]);

  const renderItem = ({ item }: { item: Gym }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GymRoutes', { gymId: item.id, gymName: item.name })}
    >
      <Text style={styles.gymName}>{item.name}</Text>
      <Text style={styles.gymMeta}>{[item.city, item.address].filter(Boolean).join(' • ') || 'No details'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={gyms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={gyms.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>No gyms found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f4f4f5',
    marginBottom: 12
  },
  gymName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  gymMeta: {
    color: '#555'
  },
  errorText: {
    color: '#d00',
    marginBottom: 12,
    textAlign: 'center'
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666'
  }
});
