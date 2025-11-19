import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>{user?.email ?? 'Unknown user'}</Text>
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 16,
    color: '#555'
  }
});
