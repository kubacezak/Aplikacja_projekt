import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GymRoutesScreen } from '../screens/GymRoutesScreen';
import { GymsListScreen } from '../screens/GymsListScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="GymsList" component={GymsListScreen} options={{ title: 'Gyms' }} />
    <Stack.Screen
      name="GymRoutes"
      component={GymRoutesScreen}
      options={({ route }) => ({ title: route.params.gymName })}
    />
  </Stack.Navigator>
);
