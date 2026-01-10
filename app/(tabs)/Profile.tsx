import { Image, StyleSheet, View, ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/lib/auth-context'
import tw from 'twrnc'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import EvilIcons from '@expo/vector-icons/EvilIcons'

export default function Profile() {
  const { user, signOut } = useAuth()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={styles.title}>Profile</Text>

        <Button
          mode='text'
          onPress={signOut}
          icon={() => (
            <FontAwesome5 name='pencil-alt' size={18} color='#6200ee' />
          )}
        >
          <Text style={tw`text-[#6200ee] text-xs`}>Edit</Text>
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={tw`w-full`}>
        <View style={tw`items-center mb-6`}>
          <Image
            source={require('@/assets/imga/users.jpeg')}
            style={styles.image}
          />

          <Text style={tw`text-xl font-bold text-zinc-900 mt-2`}>
            {user?.name || 'No name'}
          </Text>

          <Text style={tw`text-sm text-zinc-500`}>{user?.email}</Text>
        </View>

        <View style={tw`flex-row justify-between mb-6`}>
          <StatCard value='24' label='Trainings' />
          <StatCard value='7' label='Weeks' />
          <StatCard value='6' label='Months' />
        </View>

        <View style={tw`bg-white rounded-2xl p-4 border border-gray-200 mb-6`}>
          <Text
            style={tw`text-xl font-semibold text-zinc-900 mb-4 text-[#6200ee]`}
          >
            Personal data
          </Text>

          <InfoRow icon='email-outline' label='Email' value={user?.email} />
          <Divider />
          <InfoRow icon='scale-bathroom' label='Weight' value='75 kg' />
          <Divider />
          <InfoRow icon='human-male-height' label='Height' value='175 cm' />
          <Divider />
          <InfoRow icon='target' label='Target' value='Weight loss' />
        </View>

        <View style={tw`rounded-2xl  mb-6 flex gap-2`}>
          <Text style={tw`text-[#6200ee] text-xl`}>Achievements</Text>
          <View
            style={tw`w-full bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center gap-3`}
          >
            <View style={tw`bg-yellow-100 p-3 rounded-xl`}>
              <EvilIcons name='trophy' size={28} color='#f59e0b' />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-black font-semibold text-base`}>
                First training session
              </Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>
                Completed the first run
              </Text>
            </View>
          </View>
          <View
            style={tw`w-full bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center gap-3`}
          >
            <View style={tw`bg-yellow-100 p-3 rounded-xl`}>
              <EvilIcons name='trophy' size={28} color='#f59e0b' />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-black font-semibold text-base`}>10 km</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>
                ran 10 kilometers
              </Text>
            </View>
          </View>
          <View
            style={tw`w-full bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center gap-3`}
          >
            <View style={tw`bg-yellow-100 p-3 rounded-xl`}>
              <EvilIcons name='trophy' size={28} color='#f59e0b' />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-black font-semibold text-base`}>
                First training session
              </Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>
                Completed the first run
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View
      style={tw`flex-1 mx-1 py-4 bg-white rounded-2xl items-center border border-gray-200`}
    >
      <Text style={tw`text-2xl font-bold text-zinc-900`}>{value}</Text>
      <Text style={tw`text-sm text-zinc-500 mt-1`}>{label}</Text>
    </View>
  )
}

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={tw`flex-row items-center py-3`}>
      <MaterialCommunityIcons name={icon} size={22} color='#52525b' />
      <View style={tw`ml-3`}>
        <Text style={tw`text-xs text-zinc-500`}>{label}</Text>
        <Text style={tw`text-sm font-medium text-zinc-900`}>{value}</Text>
      </View>
    </View>
  )
}

function Divider() {
  return <View style={tw`h-px bg-zinc-200`} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 96,
  },
  title: {
    color: '#6200ee',
    fontSize: 22,
    fontWeight: 'bold',
  },
})
