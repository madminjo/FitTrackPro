import React, { useState, useEffect } from 'react'
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import tw from 'twrnc'
import { useAuth } from '@/lib/auth-context'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'

// Типы для тренировок
type Exercise = {
	name: string
	sets: number
	reps: string
	rest: string
	duration?: string
	icon: string
	color: string
}

type WorkoutPlan = {
	title: string
	duration: string
	calories: number
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
	focus: string

}

export default function Activity() {
	const { user } = useAuth()
	const [loading, setLoading] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
	const [timer, setTimer] = useState(0)
	const [isActive, setIsActive] = useState(false)

	// Планы тренировок на основе целей пользователя
	const workoutPlans: Record<string, WorkoutPlan[]> = {
		'lose weight': [
			{
				title: 'Fat Burn HIIT',
				duration: '30 mins',
				calories: 350,
				difficulty: 'Beginner',
				focus: 'Cardio & Full Body'
			},
			{
				title: 'Metabolic Circuit',
				duration: '40 mins',
				calories: 450,
				difficulty: 'Intermediate',
				focus: 'Strength & Cardio'
			}
		],
		'gain muscle': [
			{
				title: 'Full Body Strength',
				duration: '45 mins',
				calories: 300,
				difficulty: 'Intermediate',
				focus: 'Strength Building'
			}
		],
		'default': [
			{
				title: 'Beginner Full Body',
				duration: '25 mins',
				calories: 250,
				difficulty: 'Beginner',
				focus: 'All-round Fitness'
			}
		]
	}

	// Получаем цель пользователя
	const userGoal = user?.goal || 'lose weight'
	const availablePlans = workoutPlans[userGoal] || workoutPlans['default']

	// Таймер для тренировки
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null
		
		if (isActive) {
			interval = setInterval(() => {
				setTimer((timer) => timer + 1)
			}, 1000)
		} else if (!isActive && timer !== 0) {
			clearInterval(interval!)
		}
		
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isActive, timer])

	const startWorkout = (plan: WorkoutPlan) => {
		setSelectedPlan(plan)
		setTimer(0)
		setIsActive(true)
		Alert.alert('Workout Started!', `You've started ${plan.title}. Good luck!`)
	}

	const stopWorkout = () => {
		setIsActive(false)
		const minutes = Math.floor(timer / 60)
		const seconds = timer % 60
		Alert.alert(
			'Workout Completed!',
			`Great job! You worked out for ${minutes}m ${seconds}s`
		)
	}

	const formatTime = (totalSeconds: number) => {
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const generateWorkout = () => {
		setLoading(true)
		// Симуляция генерации AI тренировки
		setTimeout(() => {
			const randomPlan = availablePlans[Math.floor(Math.random() * availablePlans.length)]
			setSelectedPlan(randomPlan)
			setLoading(false)
			Alert.alert('New Workout Generated!', 'AI has created a personalized workout for you.')
		}, 1500)
	}

	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`flex-row justify-between items-center mb-6`}>
				<View>
					<Text style={tw`text-gray-500 text-sm`}>Personal Trainer</Text>
					<Text style={styles.header}>Workout Plans</Text>
				</View>
				<TouchableOpacity 
					onPress={generateWorkout}
					disabled={loading}
					style={tw`bg-purple-100 p-3 rounded-lg`}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#7C3AED" />
					) : (
						<Feather name="refresh-cw" size={20} color="#6200ee" />
					)}
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-8`}>
				<LinearGradient
					colors={['#6200ee', '#502b84ff']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[tw`rounded-3xl p-6 mb-6`, styles.cardShadow]}
				>
					<View style={tw`flex-row items-center justify-between`}>
						<View style={tw`flex-1`}>
							<Text style={tw`text-white text-xl font-bold mb-2`}>
								Personalized Workouts
							</Text>
							<Text style={tw`text-green-100 text-sm mb-4`}>
								AI-generated workouts based on your goal: {userGoal}
							</Text>
							<View style={tw`flex-row items-center`}>
								<View style={tw`bg-white/20 px-3 py-1 rounded-full mr-3`}>
									<Text style={tw`text-white text-xs font-medium`}>
										{user?.physical_activity || 'Beginner'} Level
									</Text>
								</View>
								<View style={tw`bg-white/20 px-3 py-1 rounded-full`}>
									<Text style={tw`text-white text-xs font-medium`}>
										Goal: {userGoal}
									</Text>
								</View>
							</View>
						</View>
						<View style={tw`bg-white/20 p-4 rounded-2xl`}>
							<Feather name="activity" size={32} color="white" />
						</View>
					</View>
				</LinearGradient>


				<View style={[tw`rounded-2xl p-5 mb-6`, styles.cardShadow, { backgroundColor: 'white' }]}>
					<View style={tw`flex-row justify-between items-center mb-4`}>
						<Text style={tw`text-xl font-bold text-gray-800`}>Recommended Plans</Text>
						<Feather name="target" size={20} color="#7C3AED" />
					</View>

					<Text style={tw`text-gray-600 mb-4`}>
						Based on your goal: <Text style={tw`font-bold text-[#7C3AED]`}>{userGoal}</Text>
					</Text>

					{availablePlans.map((plan, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => startWorkout(plan)}
							disabled={isActive}
							style={[
								tw`border-2 border-gray-100 rounded-2xl p-4 mb-4`,
								selectedPlan?.title === plan.title && tw`border-[#7C3AED] bg-purple-50`
							]}
						>
							<View style={tw`flex-row justify-between items-center mb-3`}>
								<View>
									<Text style={tw`text-lg font-bold text-[#6200ee]`}>{plan.title}</Text>
									<View style={tw`flex-row items-center mt-1 gap-3`}>
										<View style={tw`flex-row items-center`}>
											<Feather name="clock" size={14} color="#6B7280" />
											<Text style={tw`text-gray-600 text-sm ml-1`}>{plan.duration}</Text>
										</View>
										<View style={tw`flex-row items-center`}>
											<AntDesign name="fire" size={14} color="#FF5722" />
											<Text style={tw`text-gray-600 text-sm ml-1`}>{plan.calories} cal</Text>
										</View>
										<View style={[
											tw`px-2 py-1 rounded-full`,
											plan.difficulty === 'Beginner' && tw`bg-green-100`,
											plan.difficulty === 'Intermediate' && tw`bg-yellow-100`,
											plan.difficulty === 'Advanced' && tw`bg-red-100`
										]}>
											<Text style={[
												tw`text-xs font-medium`,
												plan.difficulty === 'Beginner' && tw`text-green-700`,
												plan.difficulty === 'Intermediate' && tw`text-yellow-700`,
												plan.difficulty === 'Advanced' && tw`text-red-700`
											]}>
												{plan.difficulty}
											</Text>
										</View>
									</View>
								</View>
								<Feather name="chevron-right" size={20} color="#9CA3AF" />
							</View>

							<Text style={tw`text-gray-500 text-sm mb-3`}>Focus: {plan.focus}</Text>

						</TouchableOpacity>
					))}
				</View>
				<View style={[tw`rounded-2xl p-5`, styles.cardShadow, { backgroundColor: 'white' }]}>
					<Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Weekly Progress</Text>
					
					<View style={tw`flex-row justify-between mb-6`}>
						<View style={tw`items-center flex-1`}>
							<View style={tw`bg-[#F0FDF4] p-3 rounded-2xl mb-2`}>
								<Feather name="target" size={24} color="#6200ee" />
							</View>
							<Text style={tw`text-2xl font-bold text-[#6200ee]`}>3/5</Text>
							<Text style={tw`text-gray-600 text-sm`}>Workouts</Text>
						</View>
						
						<View style={tw`items-center flex-1`}>
							<View style={tw`bg-[#F0FDF4] p-3 rounded-2xl mb-2`}>
								<AntDesign name="fire" size={24} color="#6200ee" />
							</View>
							<Text style={tw`text-2xl font-bold text-[#6200ee]`}>1,250</Text>
							<Text style={tw`text-gray-600 text-sm`}>Calories Burned</Text>
						</View>
						
						<View style={tw`items-center flex-1`}>
							<View style={tw`bg-[#F0FDF4] p-3 rounded-2xl mb-2`}>
								<Feather name="clock" size={24} color="#6200ee" />
							</View>
							<Text style={tw`text-2xl font-bold text-[#6200ee]`}>2h 30m</Text>
							<Text style={tw`text-gray-600 text-sm`}>Active Time</Text>
						</View>
					</View>

					<View style={tw`bg-gray-50 rounded-2xl p-4`}>
						<View style={tw`flex-row justify-between mb-2`}>
							<Text style={tw`text-gray-700`}>Weekly Goal Progress</Text>
							<Text style={tw`font-bold text-gray-800`}>60%</Text>
						</View>
						<View style={tw`h-3 bg-gray-200 rounded-full overflow-hidden`}>
							<View style={[tw`h-full bg-[#7C3AED] rounded-full`, { width: '60%' }]} />
						</View>
						<Text style={tw`text-gray-500 text-xs mt-2 text-center`}>
							2 more workouts to reach your goal
						</Text>
					</View>
				</View>
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
	header: {
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