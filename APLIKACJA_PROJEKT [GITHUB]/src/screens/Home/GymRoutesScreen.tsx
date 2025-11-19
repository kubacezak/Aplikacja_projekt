import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'

import { supabase } from '../../../supabaseClient'
import type { HomeStackParamList } from '../../navigation/types'

type GymRoutesRouteProp = RouteProp<HomeStackParamList, 'GymRoutes'>

type RouteItem = {
	id: string
	name: string
	grade: string
	style: string
}

const GymRoutesScreen: React.FC = () => {
	const route = useRoute<GymRoutesRouteProp>()
	const { gymId } = route.params
	const [routes, setRoutes] = useState<RouteItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		const fetchRoutes = async () => {
			setLoading(true)
			const { data, error } = await supabase
				.from('routes')
				.select('*')
				.eq('gym_id', gymId)
				.order('created_at', { ascending: false })
			if (error) {
				console.warn('Error fetching routes', error.message)
			} else if (mounted && data) {
				setRoutes(data as RouteItem[])
			}
			setLoading(false)
		}

		fetchRoutes()
		return () => {
			mounted = false
		}
	}, [gymId])

	const onPress = (item: RouteItem) => {
		Alert.alert('Selected route', `${item.name} (${item.id})`)
		console.log('Selected route', item)
	}

	const renderItem = ({ item }: { item: RouteItem }) => (
		<Pressable style={styles.item} onPress={() => onPress(item)}>
			<Text style={styles.title}>{item.name}</Text>
			<Text style={styles.subtitle}>
				{item.grade} · {item.style}
			</Text>
		</Pressable>
	)

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={routes}
				keyExtractor={item => item.id}
				renderItem={renderItem}
				ListEmptyComponent={<Text style={styles.empty}>No routes found for this gym.</Text>}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
	title: { fontSize: 16, fontWeight: '600' },
	subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
	center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	empty: { textAlign: 'center', marginTop: 16, color: '#666' },
})

export default GymRoutesScreen
