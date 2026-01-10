import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather'
import tw from 'twrnc'




export default function Activity() {
	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`flex flex-row justify-center items-center w-full mb-4`}>
				<Text style={styles.text}>Activity</Text>
			</View>
			<View>

				<ScrollView
					style={tw`w-full`}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={tw`pb-4 gap-4`}
				>

					<View style={styles.block}>
						<View style={styles.iconBox}>
							<Feather name="trending-up" size={28} color="#6200ee" />
						</View>

						<View>
							<Text style={tw`text-2xl font-bold text-black`}>Activity</Text>
							<Text style={tw`text-base text-gray-600 max-w-[200px]`}>
								Track your runs in real time.
							</Text>
						</View>
					</View>

					<View>
						
					</View>



				</ScrollView>


			</View>
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
	block: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingRight: 10,
	},
	iconBox: {
		width: 80,
		height: 80,
		borderRadius: 20,
		backgroundColor: '#f3edff',
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 6,
	},
})
