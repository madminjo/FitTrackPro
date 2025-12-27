import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';


export default function Calories() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={tw`flex flex-row justify-center items-center w-full mb-4`}>
				<Text style={styles.text}>Calories</Text>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f5f5f5',
		alignItems: 'center',   // оставляем
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
