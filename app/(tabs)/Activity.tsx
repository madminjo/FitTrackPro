import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import tw from 'twrnc'
import { useAuth } from '@/lib/auth-context'
import Feather from '@expo/vector-icons/Feather'
import { Workout } from '@/lib/auth-context'

export default function Activity() {
  const { user, getWorkouts } = useAuth()
  const [loading, setLoading] = useState(false)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const userGoal = user?.goal || 'lose weight'


  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      const response = await getWorkouts(pageNum)
      
      if (response) {
        setWorkouts(response.results)
        // Рассчитываем общее количество страниц
        const totalItems = response.count
        const itemsPerPage = response.results.length
        setTotalPages(Math.ceil(totalItems / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
      Alert.alert('Error', 'Failed to load workouts')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchWorkouts(1)
    setPage(1)
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchWorkouts(nextPage)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1
      setPage(prevPage)
      fetchWorkouts(prevPage)
    }
  }

  const renderDifficultyBadge = (difficulty: string) => {
    let color = ''
    let text = ''
    
    switch(difficulty) {
      case 'beginner':
        color = 'bg-green-100'
        text = 'Начинающий'
        break
      case 'intermediate':
        color = 'bg-yellow-100'
        text = 'Средний'
        break
      case 'advanced':
        color = 'bg-red-100'
        text = 'Продвинутый'
        break
      default:
        color = 'bg-gray-100'
        text = difficulty
    }
    
    return (
      <View style={tw`${color} px-3 py-1 rounded-full`}>
        <Text style={tw`text-xs font-medium`}>{text}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <View>
          <Text style={tw`text-gray-500 text-sm`}>Personal Trainer</Text>
          <Text style={styles.header}>Workout Plans</Text>
        </View>
        <TouchableOpacity 
          onPress={handleRefresh}
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={tw`pb-8`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6200ee']}
          />
        }
      >
        <LinearGradient
          colors={['#6200ee', '#502b84ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[tw`rounded-3xl p-6 mb-6`, styles.cardShadow]}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-xl font-bold mb-2`}>
                Персональные тренировки
              </Text>
              <Text style={tw`text-green-100 text-sm mb-4`}>
                Всего тренировок: {workouts.length}
              </Text>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-white/20 px-3 py-1 rounded-full mr-3`}>
                  <Text style={tw`text-white text-xs font-medium`}>
                    {user?.physical_activity || 'Начинающий'} уровень
                  </Text>
                </View>
                <View style={tw`bg-white/20 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-white text-xs font-medium`}>
                    Цель: {userGoal === 'lose weight' ? 'Похудение' : userGoal}
                  </Text>
                </View>
              </View>
            </View>
            <View style={tw`bg-white/20 p-4 rounded-2xl`}>
              <Feather name="activity" size={32} color="white" />
            </View>
          </View>
        </LinearGradient>

        {/* Список тренировок */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-bold mb-4 text-gray-800`}>Доступные тренировки</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" style={tw`my-8`} />
          ) : workouts.length === 0 ? (
            <View style={tw`items-center py-8`}>
              <Feather name="frown" size={48} color="#9ca3af" />
              <Text style={tw`text-gray-500 mt-2`}>Нет доступных тренировок</Text>
            </View>
          ) : (
            workouts.map((workout) => (
              <TouchableOpacity 
                key={workout.id}
                style={[tw`bg-white rounded-xl p-4 mb-4`, styles.cardShadow]}
                onPress={() => Alert.alert(workout.title, 'Открыть детали тренировки')}
              >
                <View style={tw`flex-row`}>
                  {workout.images ? (
                    <Image 
                      source={{ uri: workout.images }}
                      style={tw`w-20 h-20 rounded-lg mr-4`}
                    />
                  ) : (
                    <View style={tw`w-20 h-20 rounded-lg mr-4 bg-gray-200 items-center justify-center`}>
                      <Feather name="image" size={32} color="#9ca3af" />
                    </View>
                  )}
                  
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row justify-between items-start`}>
                      <Text style={tw`text-lg font-bold text-gray-800 flex-1 mr-2`}>
                        {workout.title}
                      </Text>
                      {renderDifficultyBadge(workout.difficulty)}
                    </View>
                    
                    <Text style={tw`text-gray-500 text-sm mt-2`}>
                      Создано: {new Date(workout.created_at).toLocaleDateString()}
                    </Text>
                    
                    <View style={tw`flex-row items-center mt-2`}>
                      <Feather name="bar-chart-2" size={16} color="#6200ee" />
                      <Text style={tw`text-sm text-gray-600 ml-2`}>
                        Упражнений: {workout.exercises.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Пагинация */}
        {totalPages > 1 && (
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={page === 1}
              style={tw`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-200' : 'bg-purple-100'}`}
            >
              <Text style={tw`${page === 1 ? 'text-gray-400' : 'text-purple-800'}`}>
                Назад
              </Text>
            </TouchableOpacity>
            
            <Text style={tw`text-gray-600`}>
              Страница {page} из {totalPages}
            </Text>
            
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={page === totalPages}
              style={tw`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-200' : 'bg-purple-100'}`}
            >
              <Text style={tw`${page === totalPages ? 'text-gray-400' : 'text-purple-800'}`}>
                Вперед
              </Text>
            </TouchableOpacity>
          </View>
        )}
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