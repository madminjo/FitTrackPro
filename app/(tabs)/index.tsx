import { useAuth } from '@/lib/auth-context'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Button, Icon } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { Link } from 'expo-router'

export default function Index() {
	const { signOut } = useAuth()
	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`flex flex-row justify-between items-center w-full mb-4`}>
				<Text style={styles.text}>Home</Text>
				<Button
					mode='text'
					onPress={signOut}
					icon={() => <Icon source='logout' size={20} color='#6200ee' />}
				>
					<Text style={tw`text-[#6200ee] text-xs`}>Sign Out</Text>
				</Button>
			</View>
			<ScrollView
				style={tw`w-full`}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={tw`pb-4 gap-4 px-2`}
			>
				<View style={tw`gap-4`}>
					<View style={tw`items-center gap-2 mb-4`}>
						<View
							style={[
								tw`items-center mb-4 border border-gray-300 w-28 p-8 rounded-2xl self-center`,
								{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.25,
									shadowRadius: 6,
									elevation: 10,
									borderRadius: 16,
								},
							]}
						>
							<AntDesign name='heart' size={35} color='#6200ee' />
						</View>
						<Text style={tw`text-3xl font-bold text-center`}>FitTrack Pro</Text>
						<Text style={tw`text-lg text-center text-gray-600`}>
							Your personal fitness assistant
						</Text>
					</View>

					<View
						style={[
							tw`mb-4 p-8 bg-white rounded-xl shadow-md`,
							{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 6 },
								shadowOpacity: 0.25,
								shadowRadius: 6,
								elevation: 10,
								borderRadius: 16,
							},
						]}
					>
						<Text style={tw`text-2xl font-bold text-center mb-2`}>
							Welcome! 👋
						</Text>
						<Text style={tw`text-center text-base text-gray-700`}>
							FitTrack Pro is a modern app for tracking your physical activity,
							calories, and achieving your fitness goals. Use the power of AI to
							analyze your nutrition and monitor your progress in real time!
						</Text>
					</View>

					<Text style={tw`text-xl font-bold text-center mb-2`}>
						Application capabilities:
					</Text>

					<View
						style={[
							tw`flex-row items-center gap-4 mb-4 p-4 bg-white rounded-xl shadow-md`,
							{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 6 },
								shadowOpacity: 0.25,
								shadowRadius: 6,
								elevation: 10,
								borderRadius: 16,
							},
						]}
					>
						<Link href='/Calories'>
							<View
								style={tw`mb-2 border border-gray-300 py-4 px-5 bg-[#6200ee] rounded-2xl`}
							>
								<MaterialIcons name='food-bank' size={30} color='#fff' />
							</View>
						</Link>

						<Link href='/Calories'>
							<View>
								<Text style={tw`text-2xl font-bold`}>Calories</Text>
								<Text style={tw`text-gray-600`}>Track calories with AI</Text>
							</View>
						</Link>
					</View>

					<View
						style={[
							tw`flex-row items-center gap-4 mb-4 p-4 bg-white rounded-xl shadow-md`,
							{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 6 },
								shadowOpacity: 0.25,
								shadowRadius: 6,
								elevation: 10,
								borderRadius: 16,
							},
						]}
					>
						<Link href='/Activity'>
							<View
								style={tw`mb-2 border border-gray-300 py-4 px-5 bg-[#6200ee] rounded-2xl`}
							>
								<Feather name='activity' size={30} color='#fff' />
							</View>
						</Link>

						<Link href='/Activity'>
							<View>
								<Text style={tw`text-2xl font-bold`}>Activity</Text>
								<Text style={tw`text-gray-600`}>
									Track your runs in real time
								</Text>
							</View>
						</Link>
					</View>

					<View
						style={[
							tw`flex-row items-center gap-4 mb-4 p-4 bg-white rounded-xl shadow-md`,
							{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 6 },
								shadowOpacity: 0.25,
								shadowRadius: 6,
								elevation: 10,
								borderRadius: 16,
							},
						]}
					>
						<Link href='/Profile'>
							<View
								style={tw`mb-2 border border-gray-300 py-4 px-5 bg-[#6200ee] rounded-2xl`}
							>
								<FontAwesome6 name='user' size={30} color='#fff' />
							</View>
						</Link>

						<Link href='/Profile'>
							<View>
								<Text style={tw`text-2xl font-bold`}>Profile</Text>
								<Text style={tw`text-gray-600`}>
									Manage your profile and goals
								</Text>
							</View>
						</Link>
					</View>

					<Text style={tw`text-xl font-bold text-center mb-2`}>
						Platform statistics
					</Text>

					<View style={tw`flex-row justify-between mt-4 gap-2`}>
						<View
							style={[
								tw`flex gap-7 items-center border bg-[#6200ee]/90 border-gray-300 py-4 rounded-2xl w-26`,
								{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.25,
									shadowRadius: 6,
									elevation: 10,
									borderRadius: 16,
								},
							]}
						>
							<Feather name='trending-up' size={32} color='white' />
							<Text style={tw`text-white text-xl text-bold`}>12.5k</Text>
							<Text style={tw`text-gray-200 text-bold text-sm`}>
								Active users
							</Text>
						</View>

						<View
							style={[
								tw`flex gap-7 items-center border border-gray-300 bg-[#6200ee]/90 py-4 rounded-2xl w-26`,
								{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.25,
									shadowRadius: 6,
									elevation: 10,
									borderRadius: 16,
								},
							]}
						>
							<Feather name='target' size={32} color='white' />
							<Text style={tw`text-white text-xl text-bold`}>89%</Text>
							<Text style={tw`text-gray-200 text-bold text-sm`}>
								Goals achieved
							</Text>
						</View>

						<View
							style={[
								tw`flex gap-7 items-center border border-gray-300 bg-[#6200ee]/90 py-4 rounded-2xl w-26`,
								{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.25,
									shadowRadius: 6,
									elevation: 10,
									borderRadius: 16,
								},
							]}
						>
							<SimpleLineIcons name='energy' size={32} color='white' />
							<Text style={tw`text-white text-xl text-bold`}>500+</Text>
							<Text style={tw`text-gray-200 text-bold text-sm`}>
								Workout per day
							</Text>
						</View>
					</View>

					<View
						style={[
							tw`border border-gray-400 items-center gap-4 justify-center bg-[#6200ee] py-4 px-5 `,
							{
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 6 },
								shadowOpacity: 0.25,
								shadowRadius: 6,
								elevation: 10,
								borderRadius: 16,
							},
						]}
					>
						<View
							style={[
								tw`items-center mb-4  bg-[#f5f5f5] border border-gray-300 w-28 p-8 rounded-2xl self-center`,
								{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.25,
									shadowRadius: 6,
									elevation: 10,
									borderRadius: 16,
								},
							]}
						>
							<AntDesign name='heart' size={35} color='#6200ee' />
						</View>
						<Text style={tw`text-bold text-2xl text-white`}>
							Start your journey
						</Text>

						<Text style={tw`text-center text-sm text-white`}>
							Join thousands of users who have already achieved their goals!
						</Text>

						<Link href='/Calories'>
							<Button
								style={tw`border border-gray-300 py-1 px-8 bg-white rounded-xl text-[#6200ee]`}
							>
								Start now
							</Button>
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 8,
		paddingHorizontal: 8,
		backgroundColor: '#f5f5f5',
	},
	text: {
		color: '#6200ee',
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
		marginVertical: 4,
	},
})
