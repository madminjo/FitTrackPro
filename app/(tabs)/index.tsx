 import { useAuth } from '@/lib/auth-context'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Button, Icon } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'

export default function Index() {
	const { signOut } = useAuth()
	return (
		<SafeAreaView style={styles.container}>
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
			<ScrollView style={tw`w-full`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-16 gap-4 px-2`}>
			<View style={tw`gap-4`}>
				<View
					style={[
						tw`mb-4 text-center  p-4 rounded-xl bg-[#6200ee]/70`,
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
					<Text style={tw`text-2xl font-bold text-center text-white mb-2`}>
						Welcome to Our Health App
					</Text>
					<Text style={tw`text-white text-center`}>
						This app helps you stay healthy, eat better, track your activity,
						and improve your lifestyle. Here you can explore all main features
						of our program.
					</Text>
				</View>

				<View
					style={[
						tw`mb-4 p-6 rounded-xl bg-white`,
						{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 6 },
							shadowOpacity: 0.25,
							shadowRadius: 6,
							elevation: 10,
							borderRadius: 16,
							backgroundColor: '#fff',
						},
					]}
				>
					<Text style={tw`text-xl font-bold text-black text-center`}>
						🏠 Home
					</Text>
					<Text style={tw`text-black text-center`}>
						This page introduces our app and shows what you can do here. You can
						learn about healthy eating, physical activity, and our AI assistant.
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
		padding: 16,
		backgroundColor: '#f5f5f5ff',
		// alignItems: 'center', // оставляем
		// justifyContent: 'center', <<< ЭТО УБРАЛИ
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