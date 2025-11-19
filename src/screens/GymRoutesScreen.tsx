import { useCallback, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { supabase } from '../../supabaseClient';
import type { HomeStackParamList } from '../navigation/types';

type GymRoutesScreenRouteProp = RouteProp<HomeStackParamList, 'GymRoutes'>;

type RouteItem = {
  id: string;
  name: string;
  grade: string | null;
  style: string | null;
};

export const GymRoutesScreen = () => {
  const { params } = useRoute<GymRoutesScreenRouteProp>();
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from<RouteItem>('routes')
        .select('id, name, grade, style')
        .eq('gym_id', params.gymId)
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setRoutes(data ?? []);
    } catch (err) {
      console.error('Failed to fetch routes', err);
      setError('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  }, [params.gymId]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handleRoutePress = (route: RouteItem) => {
    Alert.alert(route.name, `Grade: ${route.grade ?? 'n/a'}\nStyle: ${route.style ?? 'n/a'}`);
  };

  const renderItem = ({ item }: { item: RouteItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleRoutePress(item)}>
      <Text style={styles.routeName}>{item.name}</Text>
      <Text style={styles.routeMeta}>{[item.grade, item.style].filter(Boolean).join(' • ') || 'No additional info'}</Text>
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
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={routes.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>No routes found for this gym.</Text>}
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
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  routeMeta: {
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
