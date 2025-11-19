import { StyleSheet, Text, View } from 'react-native';

export const AddScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ascent</Text>
      <Text>Quickly log your latest climb.</Text>
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
