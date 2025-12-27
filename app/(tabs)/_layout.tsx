import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerStyle: { backgroundColor: '#f5f5f5' },
				headerShadowVisible: false,
				tabBarStyle: {
					backgroundColor: '#f5f5f5',
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
				},
				tabBarActiveTintColor: '#6200ee',
				tabBarInactiveTintColor: '#6200ee',
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					 headerShown: false,
					title: "Home",
					tabBarIcon: ({ color }) => (
						<FontAwesome name='home' size={20} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='Calories'
				options={{
					 headerShown: false,
					title: 'Calories',
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="food-bank" size={20} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='Activity'
				options={{
					 headerShown: false,
					title: 'Activity',
					tabBarIcon: ({ color }) => (
						<Feather name="activity" size={20} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='Profile'
				options={{
					 headerShown: false,
					title: 'Profile',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='user' size={20} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
