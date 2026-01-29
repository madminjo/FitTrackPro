import { Image, StyleSheet, View, ScrollView, Alert } from 'react-native'
import { Button, Text, ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/lib/auth-context'
import tw from 'twrnc'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function Profile() {
  const { user, signOut, isLoadingUser, getCurrentUser } = useAuth()

  const handleDebug = async () => {
    try {
      const currentUser = await getCurrentUser()
      Alert.alert(
        'Debug Info',
        `User: ${currentUser ? JSON.stringify(currentUser, null, 2) : 'null'}\n\nEmail: ${currentUser?.email || 'none'}`
      )
    } catch (error) {
      Alert.alert('error', 'Failed to get debug info')
    }
  }

  if (isLoadingUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="account-off" size={64} color="#999" />
          <Text variant="titleMedium" style={{ marginTop: 16, textAlign: 'center' }}>
            Please sign in to view your profile
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
            You need to log in to see your personal information
          </Text>
          <Button
            mode="contained"
            onPress={handleDebug}
            style={{ marginTop: 16 }}
          >
            Debug Info
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  // Форматирование значений
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Not set'
    }
    return String(value)
  }

  const formatGender = (gender: string | undefined) => {
    if (!gender) return 'Not set'
    return gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : gender
  }

  const formatGoal = (goal: string | undefined) => {
    if (!goal) return 'Not set'
    const goalsMap: Record<string, string> = {
      'lose weight': 'Lose Weight',
      'gain muscle': 'Gain Muscle',
      'maintain': 'Maintain',
      'improve endurance': 'Improve Endurance',
    }
    return goalsMap[goal] || goal
  }

  const formatActivity = (activity: string | undefined) => {
    if (!activity) return 'Not set'
    const activitiesMap: Record<string, string> = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'professional': 'Professional',
    }
    return activitiesMap[activity] || activity
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={tw`flex flex-row justify-between items-center w-full mb-6`}>
        <View>
          <Text style={tw`text-gray-500 text-sm`}>Welcome back,</Text>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={tw`flex-row items-center gap-2`}>
          <Button
            mode="text"
            onPress={signOut}
            icon={() => (
              <FontAwesome5 name="sign-out-alt" size={14} color="#6200ee" />
            )}
          >
            <Text style={tw`text-[#6200ee] text-xs`}>Sign Out</Text>
          </Button>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`w-full`}
        contentContainerStyle={tw`pb-6`}
      >

        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            <Image
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require('@/assets/imga/users.jpeg')
              }
              style={styles.image}
            />
            <View style={tw`absolute bottom-0 right-0 bg-[#6200ee] rounded-full p-1`}>
              <FontAwesome5 name="camera" size={12} color="white" />
            </View>
          </View>

          <Text style={tw`text-xl font-bold text-zinc-900 mt-3`}>
            {user?.first_name || user?.email?.split('@')[0] || 'User'}
          </Text>

          <Text style={tw`text-sm text-zinc-500 mt-1`}>{user?.email}</Text>

          {(user?.first_name || user?.last_name) && (
            <Text style={tw`text-sm text-zinc-400 mt-1`}>
              {user.first_name || ''} {user.last_name || ''}
            </Text>
          )}

          <Button
            mode="outlined"
            onPress={handleDebug}
            style={tw`mt-3`}
            contentStyle={tw`px-3`}
          >
            <Text style={tw`text-xs`}>Debug Info</Text>
          </Button>
        </View>
        <View style={tw`flex-row justify-between mb-6`}>
          <StatCard
            value={user.age ? String(user.age) : '18'}
            label="Age"
            icon="calendar"
          />
          <StatCard
            value={user.weight_value ? `${user.weight_value} kg` : '74'}
            label="Weight"
            icon="scale-bathroom"
          />
          <StatCard
            value={user.growth ? `${user.growth} cm` : '170'}
            label="Height"
            icon="human-male-height"
          />
        </View>


        <View style={tw`bg-white rounded-2xl p-4 border border-gray-200 mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-semibold text-zinc-900 text-[#6200ee]`}>
              Personal Data
            </Text>
            <MaterialCommunityIcons name="account-details" size={24} color="#6200ee" />
          </View>

          <InfoRow icon="email-outline" label="Email" value={formatValue(user?.email)} />
          <Divider />
          <InfoRow icon="phone" label="Phone" value={formatValue(user?.phone_number)} />
          <Divider />
          <InfoRow
            icon="account"
            label="Name"
            value={
              user?.first_name || user?.last_name
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : 'Not set'
            }
          />
          <Divider />
          <InfoRow icon="gender-male-female" label="Gender" value={formatGender(user?.gender)} />
          <Divider />
          <InfoRow icon="target" label="Goal" value={formatGoal(user?.goal)} />
          <Divider />
          <InfoRow icon="run" label="Activity Level" value={formatActivity(user?.physical_activity)} />
        </View>

        <View style={tw`rounded-2xl mb-6 flex gap-2`}>
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Text style={tw`text-[#6200ee] text-xl font-semibold`}>
              Achievements
            </Text>
            <MaterialCommunityIcons name="trophy" size={24} color="#6200ee" />
          </View>

          {[
            {
              title: 'Account Created',
              description: 'Welcome to our community!',
              icon: 'account-check'
            },
            {
              title: 'Profile Complete',
              description: 'All personal info added',
              icon: 'clipboard-check'
            },
            {
              title: 'Active User',
              description: 'Using the app regularly',
              icon: 'chart-line'
            },
          ].map((achievement, index) => (
            <View
              key={index}
              style={tw`w-full bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center gap-3`}
            >
              <View style={tw`bg-[#6200ee] p-3 rounded-xl`}>
                <MaterialCommunityIcons
                  name={achievement.icon}
                  size={24}
                  color="#ffffffff"
                />
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-black font-semibold text-base`}>
                  {achievement.title}
                </Text>
                <Text style={tw`text-gray-500 text-sm mt-1`}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <View
      style={tw`flex-1 mx-1 py-4 bg-white rounded-2xl items-center border border-gray-200`}
    >
      <MaterialCommunityIcons name={icon} size={24} color="#6200ee" />
      <Text style={tw`text-2xl font-bold text-zinc-900 mt-2`}>{value}</Text>
      <Text style={tw`text-sm text-zinc-500 mt-1`}>{label}</Text>
    </View>
  )
}

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={tw`flex-row items-center py-3`}>
      <MaterialCommunityIcons name={icon} size={22} color="#52525b" />
      <View style={tw`ml-3 flex-1`}>
        <Text style={tw`text-xs text-zinc-500`}>{label}</Text>
        <Text style={tw`text-sm font-medium text-zinc-900`}>
          {value}
        </Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6200ee',
  },
  title: {
		color: '#6200ee',
		fontSize: 24,
		fontWeight: 'bold',
  },
})