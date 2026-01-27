import { useAuth } from '@/lib/auth-context'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Button, Icon } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link } from 'expo-router'

export default function Index() {
	const { user, signOut } = useAuth()
	
	// Форматируем имя пользователя
	const getUserName = () => {
		if (user?.first_name) {
			return user.first_name
		}
		if (user?.email) {
			return user.email.split('@')[0]
		}
		return 'User'
	}

	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`flex flex-row justify-between items-center w-full mb-6`}>
				<View>
					<Text style={tw`text-gray-500 text-sm`}>Welcome back,</Text>
					<Text style={styles.userName}>{getUserName()}</Text>
				</View>
				<Button
					mode='text'
					onPress={signOut}
					icon={() => <Icon source='logout' size={18} color='#6200ee' />}
					contentStyle={tw`flex-row-reverse`}
				>
					<Text style={tw`text-[#6200ee] text-xs font-medium`}>Sign Out</Text>
				</Button>
			</View>
			
			<ScrollView
				style={tw`w-full`}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={tw`pb-8 gap-6`}
			>
				{/* Приветственная карточка */}
				<LinearGradient
					colors={['#7C3AED', '#8B5CF6', '#A78BFA']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[tw`rounded-3xl p-6 mb-2`, styles.cardShadow]}
				>
					<View style={tw`flex-row items-center justify-between`}>
						<View style={tw`flex-1`}>
							<Text style={tw`text-white text-3xl font-bold mb-2`}>
								FitTrack Pro
							</Text>
							<Text style={tw`text-purple-100 text-base mb-4`}>
								Your personal fitness journey starts here
							</Text>
							<Button
								mode="contained"
								style={tw`bg-white rounded-full w-40`}
								labelStyle={tw`text-[#7C3AED] font-bold`}
							>
								<Link href="/Calories" style={tw`text-[#7C3AED] font-bold`}>
									Get Started
								</Link>
							</Button>
						</View>
						<View style={tw`bg-white/20 p-4 rounded-2xl`}>
							<AntDesign name='heart' size={40} color='white' />
						</View>
					</View>
				</LinearGradient>

				{/* Быстрый доступ */}
				<View>
					<Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
						Quick Access
					</Text>
					<View style={tw`flex-row justify-between gap-3`}>
						<Link href="/Calories" style={tw`flex-1`}>
							<View style={[tw`p-5 rounded-2xl items-center`, styles.cardShadow, { backgroundColor: '#FEF3C7' }]}>
								<View style={tw`bg-[#F59E0B] p-3 rounded-xl mb-3`}>
									<MaterialIcons name='food-bank' size={28} color='white' />
								</View>
								<Text style={tw`font-bold text-gray-800 text-center`}>Calories</Text>
								<Text style={tw`text-gray-600 text-xs text-center mt-1`}>AI Tracking</Text>
							</View>
						</Link>
						
						<Link href="/Activity" style={tw`flex-1`}>
							<View style={[tw`p-5 rounded-2xl items-center`, styles.cardShadow, { backgroundColor: '#DCFCE7' }]}>
								<View style={tw`bg-[#10B981] p-3 rounded-xl mb-3`}>
									<Feather name='activity' size={28} color='white' />
								</View>
								<Text style={tw`font-bold text-gray-800 text-center`}>Activity</Text>
								<Text style={tw`text-gray-600 text-xs text-center mt-1`}>Real-time</Text>
							</View>
						</Link>
						
						<Link href="/Profile" style={tw`flex-1`}>
							<View style={[tw`p-5 rounded-2xl items-center`, styles.cardShadow, { backgroundColor: '#E0E7FF' }]}>
								<View style={tw`bg-[#6366F1] p-3 rounded-xl mb-3`}>
									<FontAwesome6 name='user' size={28} color='white' />
								</View>
								<Text style={tw`font-bold text-gray-800 text-center`}>Profile</Text>
								<Text style={tw`text-gray-600 text-xs text-center mt-1`}>Manage</Text>
							</View>
						</Link>
					</View>
				</View>

				{/* Статистика */}
				<View>
					<View style={tw`flex-row justify-between items-center mb-4`}>
						<Text style={tw`text-xl font-bold text-gray-800`}>
							Today's Stats
						</Text>
						<Feather name='bar-chart-2' size={22} color='#6200ee' />
					</View>
					
					<View style={tw`flex-row justify-between gap-3`}>
						<View style={[tw`p-4 rounded-2xl flex-1`, styles.cardShadow, { backgroundColor: 'white' }]}>
							<View style={tw`flex-row items-center mb-2`}>
								<View style={tw`bg-purple-100 p-2 rounded-lg mr-3`}>
									<Ionicons name='flame' size={20} color='#8B5CF6' />
								</View>
								<Text style={tw`text-gray-600 text-xs`}>Calories</Text>
							</View>
							<Text style={tw`text-2xl font-bold text-gray-800`}>1,250</Text>
							<Text style={tw`text-green-600 text-xs mt-1`}>+12% today</Text>
						</View>
						
						<View style={[tw`p-4 rounded-2xl flex-1`, styles.cardShadow, { backgroundColor: 'white' }]}>
							<View style={tw`flex-row items-center mb-2`}>
								<View style={tw`bg-blue-100 p-2 rounded-lg mr-3`}>
									<Feather name='watch' size={20} color='#3B82F6' />
								</View>
								<Text style={tw`text-gray-600 text-xs`}>Active Time</Text>
							</View>
							<Text style={tw`text-2xl font-bold text-gray-800`}>45m</Text>
							<Text style={tw`text-green-600 text-xs mt-1`}>+8% today</Text>
						</View>
					</View>
				</View>

				{/* Достижения */}
				<View>
					<View style={tw`flex-row justify-between items-center mb-4`}>
						<Text style={tw`text-xl font-bold text-gray-800`}>
							Recent Achievements
						</Text>
						<Feather name='award' size={22} color='#F59E0B' />
					</View>
					
					<View style={[tw`p-5 rounded-2xl`, styles.cardShadow, { backgroundColor: 'white' }]}>
						<View style={tw`flex-row items-center mb-4`}>
							<View style={tw`bg-yellow-100 p-3 rounded-xl mr-4`}>
								<FontAwesome5 name='fire' size={24} color='#F59E0B' />
							</View>
							<View style={tw`flex-1`}>
								<Text style={tw`font-bold text-gray-800 text-lg`}>
									7-Day Streak
								</Text>
								<Text style={tw`text-gray-600 text-sm`}>
									You've been active for 7 days in a row!
								</Text>
							</View>
						</View>
						
						<View style={tw`flex-row items-center`}>
							<View style={tw`bg-green-100 p-3 rounded-xl mr-4`}>
								<Feather name='target' size={24} color='#10B981' />
							</View>
							<View style={tw`flex-1`}>
								<Text style={tw`font-bold text-gray-800 text-lg`}>
									Goal Achieved
								</Text>
								<Text style={tw`text-gray-600 text-sm`}>
									Completed your weekly workout goal
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Прогресс */}
				<View>
					<View style={tw`flex-row justify-between items-center mb-4`}>
						<Text style={tw`text-xl font-bold text-gray-800`}>
							Weekly Progress
						</Text>
						<Feather name='trending-up' size={22} color='#10B981' />
					</View>
					
					<LinearGradient
						colors={['#6366F1', '#8B5CF6']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={[tw`rounded-2xl p-5`, styles.cardShadow]}
					>
						<View style={tw`flex-row justify-between items-center mb-6`}>
							<View>
								<Text style={tw`text-white text-2xl font-bold`}>75%</Text>
								<Text style={tw`text-purple-200 text-sm`}>Weekly Goal</Text>
							</View>
							<View style={tw`bg-white/20 p-3 rounded-xl`}>
								<SimpleLineIcons name='energy' size={28} color='white' />
							</View>
						</View>
						
						<View style={tw`mb-4`}>
							<View style={tw`flex-row justify-between mb-1`}>
								<Text style={tw`text-purple-200 text-sm`}>Progress</Text>
								<Text style={tw`text-white text-sm font-bold`}>3/4 days</Text>
							</View>
							<View style={tw`bg-white/20 h-2 rounded-full overflow-hidden`}>
								<View style={[tw`h-full bg-white rounded-full`, { width: '75%' }]} />
							</View>
						</View>
						
						<Text style={tw`text-purple-200 text-center text-sm`}>
							Keep going! You're close to your weekly goal
						</Text>
					</LinearGradient>
				</View>

				{/* Платформенная статистика */}
				<View>
					<Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
						Community Stats
					</Text>
					
					<View style={tw`flex-row justify-between gap-3`}>
						<View style={[tw`p-4 rounded-2xl items-center flex-1`, styles.cardShadow, { backgroundColor: '#F0F9FF' }]}>
							<Feather name='users' size={28} color='#0EA5E9' />
							<Text style={tw`text-2xl font-bold text-gray-800 mt-2`}>12.5k</Text>
							<Text style={tw`text-gray-600 text-xs text-center mt-1`}>Active Users</Text>
						</View>
						
						<View style={[tw`p-4 rounded-2xl items-center flex-1`, styles.cardShadow, { backgroundColor: '#F0FDF4' }]}>
							<Feather name='target' size={28} color='#10B981' />
							<Text style={tw`text-2xl font-bold text-gray-800 mt-2`}>89%</Text>
							<Text style={tw`text-gray-600 text-xs text-center mt-1`}>Goals Achieved</Text>
						</View>
						
						<View style={[tw`p-4 rounded-2xl items-center flex-1`, styles.cardShadow, { backgroundColor: '#FEF7CD' }]}>
							<SimpleLineIcons name='energy' size={28} color='#EAB308' />
							<Text style={tw`text-2xl font-bold text-gray-800 mt-2`}>500+</Text>
							<Text style={tw`text-gray-600 text-xs text-center mt-1`}>Daily Workouts</Text>
						</View>
					</View>
				</View>

				{/* CTA карточка */}
				<LinearGradient
					colors={['#10B981', '#34D399']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[tw`rounded-3xl p-6 items-center`, styles.cardShadow]}
				>
					<View style={tw`bg-white/20 p-4 rounded-2xl mb-4`}>
						<AntDesign name='rocket1' size={36} color='white' />
					</View>
					<Text style={tw`text-white text-2xl font-bold text-center mb-2`}>
						Ready to Transform?
					</Text>
					<Text style={tw`text-green-100 text-center text-sm mb-6`}>
						Join thousands who achieved their fitness goals
					</Text>
					<Link href="/Calories" style={tw`w-full`}>
						<Button
							mode="contained"
							style={tw`bg-white rounded-full`}
							labelStyle={tw`text-[#10B981] font-bold`}
							contentStyle={tw`py-2`}
						>
							Start Your Journey
						</Button>
					</Link>
				</LinearGradient>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 16,
		backgroundColor: '#f8fafc',
	},
	userName: {
		color: '#1f2937',
		fontSize: 24,
		fontWeight: 'bold',
	},
	cardShadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
})