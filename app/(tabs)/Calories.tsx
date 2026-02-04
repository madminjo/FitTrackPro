import React, { useState } from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Alert,
	ScrollView,
	ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import tw from 'twrnc'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'

type HistoryItem = {
	id: number
	name: string
	calories: number
	protein: number
	carbs: number
	fat: number
	date: string
}

type AIAnalysis = {
	food_name: string
	calories: number
	protein: number
	carbs: number
	fat: number
	serving_size: string
	confidence: number
}

export default function Calories() {
	const [image, setImage] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(false)
	const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
	const [history, setHistory] = useState<HistoryItem[]>([
		{ id: 1, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, date: 'Today' },
		{ id: 2, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, date: 'Yesterday' },
	])

	const pickImage = async () => {
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
			if (!permission.granted) {
				Alert.alert('Permission Required', 'Please allow access to your photo library')
				return
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 0.8,
				allowsEditing: true,
				aspect: [1, 1],
			})

			if (!result.canceled) {
				setImage(result.assets[0].uri)
				setAnalysis(null)
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to pick image')
			console.error(error)
		}
	}

	const analyzeFood = async () => {
		if (!image && !query.trim()) {
			Alert.alert('Error', 'Please either upload a photo or enter food name')
			return
		}

		setLoading(true)
		try {
			await new Promise(resolve => setTimeout(resolve, 2000))
			
			const mockAnalysis: AIAnalysis = {
				food_name: query || 'Mixed Salad',
				calories: Math.floor(Math.random() * 400) + 100,
				protein: Math.floor(Math.random() * 30) + 5,
				carbs: Math.floor(Math.random() * 50) + 10,
				fat: Math.floor(Math.random() * 20) + 2,
				serving_size: '1 serving',
				confidence: 85 + Math.random() * 15
			}
			
			setAnalysis(mockAnalysis)
			
			const newItem: HistoryItem = {
				id: Date.now(),
				name: mockAnalysis.food_name,
				calories: mockAnalysis.calories,
				protein: mockAnalysis.protein,
				carbs: mockAnalysis.carbs,
				fat: mockAnalysis.fat,
				date: 'Just now'
			}
			
			setHistory([newItem, ...history.slice(0, 9)])
			
			if (query) setQuery('')
			
		} catch (error) {
			Alert.alert('Analysis Failed', 'Please try again')
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const clearAll = () => {
		setImage(null)
		setQuery('')
		setAnalysis(null)
	}

	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`flex-row justify-between items-center mb-6`}>
				<View>
					<Text style={tw`text-gray-500 text-sm`}>Calorie Tracker</Text>
					<Text style={styles.header}>AI Food Analysis</Text>
				</View>
				<TouchableOpacity onPress={clearAll} style={tw`bg-purple-100 p-2 rounded-lg`}>
					<Feather name="refresh-cw" size={20} color="#6200ee" />
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-8`}>
				<LinearGradient
					colors={['#6200ee', '#502b84ff']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[tw`rounded-3xl p-6 mb-6`, styles.cardShadow]}
				>
					<View style={tw`flex-row items-center`}>
						<View style={tw`bg-white/20 p-4 rounded-2xl mr-4`}>
							<AntDesign name='fire' size={32} color='white' />
						</View>
						<View style={tw`flex-1`}>
							<Text style={tw`text-white text-xl font-bold mb-2`}>
								AI-Powered Analysis
							</Text>
							<Text style={tw`text-purple-100 text-sm`}>
								Upload a photo or enter food name to analyze calories and nutrients
							</Text>
						</View>
					</View>
				</LinearGradient>

				<View style={[tw`rounded-2xl p-5 mb-6`, styles.cardShadow, { backgroundColor: 'white' }]}>
					<Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Upload Food Photo</Text>
					
					<TouchableOpacity 
						onPress={pickImage}
						style={[
							tw`border  border-purple-300 rounded-2xl items-center justify-center p-12 mb-6`,
							image ? tw`border-solid border-purple-500` : {}
						]}
					>
						{image ? (
							<View style={tw`items-center`}>
								<Image source={{ uri: image }} style={tw`w-40 h-40 rounded-xl mb-4`} />
								<Text style={tw`text-purple-600 font-medium`}>Photo Selected ✓</Text>
							</View>
						) : (
							<View style={tw`items-center`}>
								<View style={tw`bg-purple-100 p-4 rounded-2xl mb-4`}>
									<MaterialIcons name="photo-camera" size={36} color="#6200ee" />
								</View>
								<Text style={tw`text-gray-600 text-center`}>
									Tap to upload a photo of your food
								</Text>
								<Text style={tw`text-gray-400 text-xs text-center mt-2`}>
									Supports JPG, PNG
								</Text>
							</View>
						)}
					</TouchableOpacity>
					<View style={tw`flex-row items-center gap-3`}>
						<TouchableOpacity
							onPress={analyzeFood}
							disabled={loading}
							style={[
								tw`bg-[#7C3AED] rounded-xl p-5 w-full items-center`,
								loading && tw`opacity-70`
							]}
						>
							{loading ? (
								<ActivityIndicator color="white" size="small" />
							) : (
								<Feather name="zap" size={25} color="white" />
							)}
						</TouchableOpacity>
					</View>
				</View>
				{analysis && (
					<View style={[tw`rounded-2xl p-5 mb-6`, styles.cardShadow, { backgroundColor: 'white' }]}>
						<View style={tw`flex-row justify-between items-center mb-4`}>
							<Text style={tw`text-xl font-bold text-gray-800`}>
								Analysis Results
							</Text>
							<View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
								<Text style={tw`text-green-700 text-xs font-medium`}>
									{analysis.confidence.toFixed(0)}% confident
								</Text>
							</View>
						</View>

						<View style={tw`mb-6`}>
							<Text style={tw`text-3xl font-bold text-gray-800 mb-1`}>
								{analysis.food_name}
							</Text>
							<Text style={tw`text-gray-500`}>
								Serving: {analysis.serving_size}
							</Text>
						</View>

						{/* Основные калории */}
						<View style={tw`bg-purple-50 rounded-2xl p-4 mb-4`}>
							<View style={tw`flex-row items-center justify-between mb-2`}>
								<Text style={tw`text-lg font-bold text-gray-800`}>Calories</Text>
								<AntDesign name="fire" size={24} color="#FF5722" />
							</View>
							<Text style={tw`text-4xl font-bold text-[#FF5722]`}>
								{analysis.calories}
								<Text style={tw`text-xl text-gray-600`}> kcal</Text>
							</Text>
						</View>

						{/* Макронутриенты */}
						<Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Macronutrients</Text>
						<View style={tw`flex-row justify-between gap-3`}>
							<View style={[tw`p-4 rounded-2xl flex-1`, { backgroundColor: '#E8F5E9' }]}>
								<View style={tw`flex-row items-center mb-2`}>
									<View style={tw`bg-green-200 p-2 rounded-lg mr-2`}>
										<FontAwesome5 name="drumstick-bite" size={16} color="#2E7D32" />
									</View>
									<Text style={tw`text-gray-700 font-medium`}>Protein</Text>
								</View>
								<Text style={tw`text-2xl font-bold text-gray-800`}>
									{analysis.protein}g
								</Text>
							</View>

							<View style={[tw`p-4 rounded-2xl flex-1`, { backgroundColor: '#FFF3E0' }]}>
								<View style={tw`flex-row items-center mb-2`}>
									<View style={tw`bg-yellow-200 p-2 rounded-lg mr-2`}>
										<Ionicons name="nutrition" size={16} color="#F57C00" />
									</View>
									<Text style={tw`text-gray-700 font-medium`}>Carbs</Text>
								</View>
								<Text style={tw`text-2xl font-bold text-gray-800`}>
									{analysis.carbs}g
								</Text>
							</View>

							<View style={[tw`p-4 rounded-2xl flex-1`, { backgroundColor: '#F3E5F5' }]}>
								<View style={tw`flex-row items-center mb-2`}>
									<View style={tw`bg-purple-200 p-2 rounded-lg mr-2`}>
										<FontAwesome5 name="oil-can" size={16} color="#7B1FA2" />
									</View>
									<Text style={tw`text-gray-700 font-medium`}>Fat</Text>
								</View>
								<Text style={tw`text-2xl font-bold text-gray-800`}>
									{analysis.fat}g
								</Text>
							</View>
						</View>
					</View>
				)}

				<View style={[tw`rounded-2xl p-5`, styles.cardShadow, { backgroundColor: 'white' }]}>
					<View style={tw`flex-row justify-between items-center mb-4`}>
						<Text style={tw`text-xl font-bold text-gray-800`}>Recent History</Text>
						<Feather name="clock" size={20} color="#6200ee" />
					</View>

					{history.map((item) => (
						<TouchableOpacity 
							key={item.id} 
							style={tw`flex-row justify-between items-center py-4 border-b border-gray-100 last:border-b-0`}
						>
							<View>
								<Text style={tw`font-bold text-[#6200ee]`}>{item.name}</Text>
								<View style={tw`flex-row items-center mt-1`}>
									<Text style={tw`text-gray-500 text-xs`}>{item.date} • </Text>
									<View style={tw`flex-row items-center`}>
										<AntDesign name="fire" size={12} color="#FF5722" />
										<Text style={tw`text-gray-500 text-xs ml-1`}>
											{item.calories} kcal
										</Text>
									</View>
								</View>
							</View>

							<View style={tw`flex-row items-center gap-3`}>
								<Feather name="chevron-right" size={20} color="#6200ee" />
							</View>
						</TouchableOpacity>
					))}
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
		color: '#6200ee',
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