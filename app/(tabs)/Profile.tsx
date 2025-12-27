import { Image, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/lib/auth-context'
import tw from "twrnc";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Profile() {
  const { user,signOut } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <View style={tw`flex flex-row justify-between w-full items-center mb-4`}>
        <Text style={styles.text}>Profile</Text>

        <Button
          style={styles.button}
          mode='text'
          onPress={signOut}
          icon={() => (
            <FontAwesome5 name="pencil-alt" size={20} color="#6200ee" />
          )}
        >
          <Text style={tw`text-[#6200ee] text-xs`}>edit profile</Text>
        </Button>
      </View>

      <View style={tw`items-center mb-4`}>
        <Image
          source={require('@/assets/imga/users.jpeg')}
          style={styles.image}
        />
        <Text style={tw`text-2xl font-bold text-black`}>
          {user?.name || 'No name'}
        </Text>
        <Text style={tw`text-lg text-black`}>
         {user?.email}
        </Text>

        <View style={tw`flex flex-col gap-2 mb-4`}>
          <View style={{ alignItems: 'center' }}>
            <Text style={tw`text-lg text-black`}>Joined: {user ? new Date(user.$createdAt).toLocaleDateString() : ''}</Text>
            <Text style={tw`text-lg text-black`}>Posts: 34</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={tw`text-lg text-black`}>Followers: 120</Text>
            <Text style={tw`text-lg text-black`}>Following: 80</Text>
          </View>
        </View>
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
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  text: {
    color: '#6200ee',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'transparent',
  },
})
