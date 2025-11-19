import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { supabase } from '../../../supabaseClient'
import type { HomeStackParamList } from '../../navigation/types'

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'GymsList'>

type Gym = {
	id: string
	name: string
	city?: string | null
	address?: string | null
}

const GymsListScreen: React.FC = () => {
	const navigation = useNavigation<NavProp>()
	const [gyms, setGyms] = useState<Gym[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		const fetchGyms = async () => {
			setLoading(true)
			const { data, error } = await supabase.from('gyms').select('*').order('created_at', { ascending: false })
			if (error) {
				console.warn('Error fetching gyms', error.message)
			} else if (mounted && data) {
				setGyms(data as Gym[])
			}
			setLoading(false)
		}

		fetchGyms()
		return () => {
			mounted = false
		}
	}, [])

	const renderItem = ({ item }: { item: Gym }) => (
		<Pressable
			style={styles.item}
			onPress={() => navigation.navigate('GymRoutes', { gymId: item.id, gymName: item.name })}>
			<Text style={styles.title}>{item.name}</Text>
			<Text style={styles.subtitle}>
				{item.city ?? '-'}
				{item.address ? ` · ${item.address}` : ''}
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
				data={gyms}
				keyExtractor={item => item.id}
				renderItem={renderItem}
				ListEmptyComponent={<Text style={styles.empty}>No gyms found.</Text>}
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

export default GymsListScreen
