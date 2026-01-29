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

  // Загрузка пользователя при монтировании (только если есть токен)
  useEffect(() => {
    loadUserFromStorage()
  }, [])

  const loadUserFromStorage = async () => {
    try {
      setIsLoadingUser(true)
      
      // Проверяем, есть ли токен в хранилище
      const token = await AsyncStorage.getItem('userToken')
      
      
      // Если нет токена, выходим
      if (!token) {
        setUser(null)
        return
      }
      

      
    } catch (error) {
      console.error('❌ Error loading user from storage:', error)
      setUser(null)
    } finally {
      setIsLoadingUser(false)
    }
  }





  const signIn = async (email: string, password: string): Promise<string | null> => {
    try {  
      // Очищаем предыдущий токен
      delete api.defaults.headers.common['Authorization']
      
      const response = await api.post('/accounts/login/', {
        email,
        password
      })
      
      // Проверяем наличие токена в ответе
      if (response.data.token) {
        // Сохраняем токен и email
        await AsyncStorage.setItem('userToken', response.data.token)
        await AsyncStorage.setItem('userEmail', email)
        
        // Устанавливаем заголовок для последующих запросов
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`
        
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
      // Очищаем токен
      await AsyncStorage.removeItem('userToken')
      await AsyncStorage.removeItem('userEmail')
      
      // Удаляем заголовок авторизации
      delete api.defaults.headers.common['Authorization']
      
      // Сбрасываем состояние пользователя
      setUser(null)
      
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

 

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}