import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	Alert,
	FlatList,
	ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import tw from 'twrnc'

type Scrp = {
	icon: string
	title: string
	kal: string
}

const search: Scrp[] = [
	{ icon: 'APPLE', title: 'Apples', kal: '95' },
	{ icon: 'Pizza', title: 'Pizza', kal: '266' },
	{ icon: 'Coffee', title: 'Coffee', kal: '2' },
]

export default function Calories() {
	const [image, setImage] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [imageText, setImageText] = useState('')

	const pickImage = () => {
		Alert.alert('Добавить фото', 'Выбери источник', [
			{ text: 'Камера', onPress: openCamera },
			{ text: 'Галерея', onPress: openGallery },
			{ text: 'Отмена', style: 'cancel' },
		])
	}

	const openCamera = async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync()
		if (!permission.granted) return

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
		})

		if (!result.canceled) setImage(result.assets[0].uri)
	}

	const openGallery = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permission.granted) return

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
		})

		if (!result.canceled) setImage(result.assets[0].uri)
	}

	const renderItem = ({ item }: { item: Scrp }) => (
		<View
			style={tw`bg-white px-7 py-7 border border-gray-200 rounded-xl items-center`}
		>
			<View
				style={tw`w-8 h-8 bg-[#ede7f6] rounded-2xl items-center justify-center`}
			>
				<Text style={tw`text-[#6200ee] font-bold`}>{item.icon[0]}</Text>
			</View>

			<Text style={tw`text-black font-semibold text-sm mt-1`}>
				{item.title}
			</Text>
			<Text style={tw`text-gray-500 text-xs`}>{item.kal} kcal</Text>
		</View>
	)

	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<View style={tw`w-full items-center mb-4`}>
				<Text style={styles.text}>Calories</Text>
			</View>

			<ScrollView
				style={tw`w-full`}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={tw`pb-4 gap-4`}
			>
				<View style={styles.block}>
					<View style={styles.iconBox}>
						<AntDesign name='fire' size={28} color='#6200ee' />
					</View>

					<View>
						<Text style={tw`text-2xl font-bold text-black`}>Calories</Text>
						<Text style={tw`text-base text-gray-600 max-w-[200px]`}>
							Find out the calorie content of food products using AI.
						</Text>
					</View>
				</View>

				<View style={tw`w-full mt-6`}>
					<View style={tw`border border-gray-300 rounded-2xl p-1`}>
						{image && (
							<View style={tw`flex-row gap-3 mb-3`}>
								<View style={tw`relative`}>
									<Image
										source={{ uri: image }}
										style={tw`w-25 h-25 rounded-xl`}
									/>
									<TouchableOpacity
										onPress={() => {
											setImage(null)
											setImageText('')
										}}
										style={tw`absolute -top-2 -right-2 bg-black/70 rounded-full p-1`}
									>
										<AntDesign name='close' size={14} color='white' />
									</TouchableOpacity>
								</View>

								<View style={tw`flex-1 justify-center`}>
									<Text style={tw`font-semibold text-black`}>
										Food detected
									</Text>
									<Text style={tw`text-gray-600 text-sm`}>
										AI will analyze calories from this photo.
									</Text>
								</View>
							</View>
						)}

						<View style={tw`flex-row items-center gap-2`}>
							<View
								style={tw`flex-row flex-1 items-center bg-[#ede7f6] rounded-2xl px-4 py-3`}
							>
								<Feather name='search' size={22} color='#6200ee' />
								<TextInput
									placeholder='Введи название продукта...'
									value={query}
									onChangeText={setQuery}
									style={tw`ml-3 flex-1 text-black`}
								/>
							</View>

							<TouchableOpacity
								onPress={pickImage}
								style={tw`bg-[#ede7f6] p-4 rounded-xl`}
							>
								<MaterialIcons name='photo-camera' size={24} />
							</TouchableOpacity>

							<TouchableOpacity style={tw`bg-[#6200ee] p-4 rounded-xl`}>
								<AntDesign name='star' size={18} color='white' />
							</TouchableOpacity>
						</View>

						<Text style={tw`ml-2 mt-2 text-[#6200ee]`}>Quick search:</Text>

						<FlatList
							data={search}
							renderItem={renderItem}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={(_, i) => i.toString()}
							contentContainerStyle={tw`gap-2 py-2 px-3`}
						/>
					</View>
				</View>

				<View style={tw`w-full mt-6 ml-4`}>
					<Text style={tw`text-2xl text-[#6200ee] mb-3`}>Search history</Text>

					{[1, 2, 3, 4].map(i => (
						<View
							key={i}
							style={tw`flex-row  w-80 justify-between items-center border border-gray-200 py-4 px-4 rounded-2xl mb-2 bg-white`}
						>
							<View>
								<Text style={tw`font-semibold`}>Apple</Text>
								<Text style={tw`text-gray-500 text-sm`}>1 call</Text>
							</View>

							<View style={tw`flex-row items-center`}>
								<AntDesign name='fire' size={20} color='#ff5722' />
								<Text style={tw`ml-2 font-medium`}>100 kcal</Text>
							</View>
						</View>
					))}
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
