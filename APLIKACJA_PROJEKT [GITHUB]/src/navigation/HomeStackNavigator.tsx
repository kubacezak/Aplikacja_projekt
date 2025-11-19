import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import GymsListScreen from '../screens/Home/GymsListScreen'
import GymRoutesScreen from '../screens/Home/GymRoutesScreen'
import type { HomeStackParamList } from './types'

const Stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen name='GymsList' component={GymsListScreen} options={{ title: 'Gyms' }} />
		<Stack.Screen
			name='GymRoutes'
			component={GymRoutesScreen}
			options={({ route }) => ({ title: (route.params as any)?.gymName ?? 'Routes' })}
		/>
	</Stack.Navigator>
)

export default HomeStackNavigator
