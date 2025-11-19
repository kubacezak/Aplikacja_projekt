import { StyleSheet, Text, View } from 'react-native';

export const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>
      <Text>Your recent climbing statistics will appear here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8
  }
});
