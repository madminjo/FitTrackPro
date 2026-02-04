import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api, extractErrorMessage, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoadingUser: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (userData: SignUpData) => Promise<string | null>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  getCurrentUser: () => Promise<User | null>
  getWorkouts: (page?: number, forceRefresh?: boolean) => Promise<WorkoutResponse | null>
  getNutritions: (page?: number, forceRefresh?: boolean) => Promise<NutritionResponse | null>
}

interface SignUpData {
  email: string
  password1: string
  password2: string
  firstName: string
  lastName: string
  phoneNumber: string
}

interface LoginResponse {
  token: string
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  gender?: string
  age?: number
  growth?: number
  goal?: string
  physical_activity?: string
  weight_value?: number
  avatar?: string
  username?: string
}

interface Exercise {
  id: number
  title: string
  description: string
}

interface Workout {
  id: number
  created_at: string
  updated_at: string
  title: string
  difficulty: string
  images: string
  is_publish: boolean
  exercises: Exercise[]
  favorites: any[]
}

interface WorkoutResponse {
  count: number
  next: string | null
  previous: string | null
  results: Workout[]
}

interface Ingredient {
  id: number
  name?: string
}

interface Nutrition {
  id: number
  created_at: string
  updated_at: string
  images: string
  title: string
  description: string
  estimated_calories: number
  is_publish: boolean
  duration_minutes: number
  created_by: number | null
  ingredients: number[] | Ingredient[]
  favorites: any[]
}

interface NutritionResponse {
  count: number
  next: string | null
  previous: string | null
  results: Nutrition[]
}

// Ключи для AsyncStorage
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_EMAIL: 'userEmail',
  USER_DATA: 'userData',
  AUTH_EXPIRY: 'authExpiry',
  WORKOUTS: '@FitApp:workouts',
  NUTRITIONS: '@FitApp:nutritions',
  LAST_SYNC_WORKOUTS: '@FitApp:lastSyncWorkouts',
  LAST_SYNC_NUTRITIONS: '@FitApp:lastSyncNutritions',
}

// Время жизни токена (30 дней в миллисекундах)
const TOKEN_EXPIRY_DAYS = 30
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Проверка токена на валидность
  const isTokenValid = async (): Promise<boolean> => {
    try {
      const expiryTime = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_EXPIRY)
      if (!expiryTime) return false
      
      const expiryDate = parseInt(expiryTime)
      const currentTime = Date.now()
      
      // Если токен не истек
      if (currentTime < expiryDate) {
        return true
      } else {
        // Токен истек, очищаем
        await clearAuthData()
        return false
      }
    } catch (error) {
      console.error('❌ Error checking token validity:', error)
      return false
    }
  }

  // Очистка данных авторизации
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_EMAIL,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_EXPIRY,
      ])
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } catch (error) {
      console.error('❌ Error clearing auth data:', error)
    }
  }

  // Загрузка пользователя при запуске приложения
  useEffect(() => {
    loadUserFromStorage()
  }, [])

  const loadUserFromStorage = async () => {
    try {
      setIsLoadingUser(true)

      // Проверяем валидность токена
      const isValid = await isTokenValid()
      if (!isValid) {
        setUser(null)
        return
      }

      // Получаем токен
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN)
      if (!token) {
        setUser(null)
        return
      }

      // Устанавливаем заголовок авторизации для API
      api.defaults.headers.common['Authorization'] = `Token ${token}`

      // Пытаемся получить данные пользователя из кэша
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      if (userDataString) {
        const userData: User = JSON.parse(userDataString)
        setUser(userData)
        
        // Можно сделать запрос на сервер для обновления данных
        // await refreshUserFromServer(token)
      } else {
        // Если нет данных в кэше, пробуем получить с сервера
        await refreshUserFromServer(token)
      }
      
    } catch (error) {
      console.error('❌ Error loading user from storage:', error)
      setUser(null)
      await clearAuthData()
    } finally {
      setIsLoadingUser(false)
    }
  }

  // Обновление данных пользователя с сервера
  const refreshUserFromServer = async (token: string): Promise<void> => {
    try {
      // Здесь можно сделать запрос к /accounts/user/ или аналогичному endpoint
      // для получения актуальных данных пользователя
      // const response = await api.get('/accounts/user/')
      // const userData = response.data
      
      // Временно используем старые данные или создаем минимальный объект
      const email = await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      if (email) {
        const userData: User = {
          id: Date.now(),
          email: email,
          first_name: '',
          last_name: '',
          phone_number: '',
          gender: undefined,
          age: undefined,
          growth: undefined,
          goal: undefined,
          physical_activity: undefined,
          weight_value: undefined,
          avatar: undefined,
          username: undefined
        }
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
        setUser(userData)
      }
    } catch (error) {
      console.error('❌ Error refreshing user from server:', error)
      // Если не удалось получить данные с сервера, оставляем как есть
    }
  }

  const signIn = async (email: string, password: string): Promise<string | null> => {
    try {  
      // Очищаем старые заголовки
      delete api.defaults.headers.common['Authorization']
      
      const response = await api.post('/accounts/login/', {
        email,
        password
      })
      
      // Проверяем наличие токена в ответе
      if (response.data.token) {
        const token = response.data.token
        
        // Сохраняем токен, email и время истечения
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token)
        await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)
        
        // Устанавливаем время истечения токена (30 дней с текущего момента)
        const expiryTime = Date.now() + TOKEN_EXPIRY_MS
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_EXPIRY, expiryTime.toString())
        
        // Создаем объект пользователя из ответа
        const userData: User = {
          id: Date.now(), // Или response.data.id, если есть
          email: response.data.email || email,
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone_number: response.data.phone_number || '',
          gender: response.data.gender,
          age: response.data.age,
          growth: response.data.growth,
          goal: response.data.goal,
          physical_activity: response.data.physical_activity,
          weight_value: response.data.weight_value,
          avatar: response.data.avatar,
          username: response.data.username
        }
        
        // Сохраняем данные пользователя
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
        
        // Устанавливаем заголовок для последующих запросов
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        
        // Обновляем состояние
        setUser(userData)
        
        return null // Нет ошибки
      } else {
        return 'No token received from server'
      }
      
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      return extractErrorMessage(error)
    }
  }

  const signUp = async (userData: SignUpData): Promise<string | null> => {
    try {
      delete api.defaults.headers.common['Authorization']
      
      const response = await api.post('/accounts/register/', {
        email: userData.email,
        password1: userData.password1,
        password2: userData.password2,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phoneNumber
      })
      
      // После регистрации автоматически логинимся
      return await signIn(userData.email, userData.password1)
      
    } catch (error: any) {
      console.error('❌ Sign up error:', error)
      return extractErrorMessage(error)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      // Полный выход - очищаем ВСЕ данные
      await clearAuthData()
      
      // Также очищаем кэш тренировок и питания
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter(key => 
        key.startsWith('@FitApp:') || 
        key === STORAGE_KEYS.LAST_SYNC_WORKOUTS || 
        key === STORAGE_KEYS.LAST_SYNC_NUTRITIONS
      )
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys)
      }
      
      console.log('✅ User signed out completely')
      
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  const getWorkouts = async (page: number = 1, forceRefresh: boolean = false): Promise<WorkoutResponse | null> => {
    try {
      // Проверяем, есть ли авторизация
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN)
      if (!token) {
        console.error('❌ No token found - user not authenticated')
        return null
      }

      // Устанавливаем заголовок авторизации
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      
      const response = await api.get('/workouts/workout/', {
        params: { page }
      })
      
      return response.data
      
    } catch (error: any) {
      console.error('❌ Get workouts error:', error)
      
      // Если ошибка 401 (Unauthorized), возможно токен истек
      if (error.response?.status === 401) {
        await clearAuthData()
        Alert.alert('Сессия истекла', 'Пожалуйста, войдите снова')
      }
      
      return null
    }
  }

  const getNutritions = async (page: number = 1, forceRefresh: boolean = false): Promise<NutritionResponse | null> => {
    try {
      // Проверяем, есть ли авторизация
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN)
      if (!token) {
        console.error('❌ No token found - user not authenticated')
        return null
      }

      // Устанавливаем заголовок авторизации
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      
      const response = await api.get('/nutritions/nutrition/', {
        params: { page }
      })
      
      return response.data
      
    } catch (error: any) {
      console.error('❌ Get nutritions error:', error)
      
      // Если ошибка 401 (Unauthorized), возможно токен истек
      if (error.response?.status === 401) {
        await clearAuthData()
        Alert.alert('Сессия истекла', 'Пожалуйста, войдите снова')
      }
      
      return null
    }
  }

  // Функция для проверки, авторизован ли пользователь
  const checkAuth = async (): Promise<boolean> => {
    const isValid = await isTokenValid()
    if (!isValid) {
      await clearAuthData()
    }
    return isValid
  }

  // Автоматическая проверка авторизации при загрузке компонентов
  useEffect(() => {
    const checkAuthOnLoad = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated && user) {
        setUser(null)
      }
    }
    
    checkAuthOnLoad()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        signIn,
        signUp,
        signOut,
        getWorkouts,
        getNutritions
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}