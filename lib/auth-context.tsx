import { createContext, useContext, useEffect, useState } from 'react'
import api, { 
  User, 
  extractErrorMessage, 
  checkServerConnection,
  saveUserEmail,
  getUserEmail,
  clearUserEmail 
} from './api'

type SignUpData = {
  email: string
  password1: string
  password2: string
  firstName: string
  lastName: string
  phoneNumber: string
}

type AuthContextType = {
  user: User | null
  isLoadingUser: boolean
  isCheckingConnection: boolean
  serverStatus: {
    success: boolean
    message: string
    url?: string
  } | null
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (data: SignUpData) => Promise<string | null>
  signOut: () => Promise<void>
  checkConnection: () => Promise<void>
  refreshUser: () => Promise<void>
  getCurrentUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [serverStatus, setServerStatus] = useState<AuthContextType['serverStatus']>(null)

  // Функция для поиска пользователя по email в списке
  const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
      console.log('🔍 Searching for user with email:', email)
      
      // Получаем всех пользователей
      const response = await api.get('/accounts/account/')
      console.log('📋 Server response:', response.data)
      
      let usersList: any[] = []
      
      // Проверяем формат ответа
      if (response.data && Array.isArray(response.data.results)) {
        usersList = response.data.results
      } else if (response.data && Array.isArray(response.data)) {
        usersList = response.data
      } else {
        console.error('❌ Unexpected response format:', response.data)
        return null
      }
      
      console.log('👥 Total users found:', usersList.length)
      console.log('📧 All emails:', usersList.map(u => u.email))
      
      // Ищем пользователя с нужным email
      const foundUser = usersList.find((u: any) => {
        const userEmail = u.email?.toLowerCase().trim()
        const searchEmail = email.toLowerCase().trim()
        return userEmail === searchEmail
      })
      
      if (foundUser) {
        console.log('✅ User found:', foundUser)
        return {
          id: foundUser.id || Date.now(),
          email: foundUser.email || email,
          first_name: foundUser.first_name,
          last_name: foundUser.last_name,
          phone_number: foundUser.phone_number,
          gender: foundUser.gender,
          age: foundUser.age,
          growth: foundUser.growth,
          goal: foundUser.goal,
          physical_activity: foundUser.physical_activity,
          weight_value: foundUser.weight_value,
          avatar: foundUser.avatar,
          username: foundUser.username,
        }
      } else {
        console.log('❌ User not found in list')
        console.log('🔍 Searching email:', email)
        console.log('📧 Available emails:', usersList.map(u => u.email))
        return null
      }
    } catch (error: any) {
      console.error('❌ Error finding user:', error)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
      return null
    }
  }

  // Функция для получения текущего пользователя
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const savedEmail = await getUserEmail()
      if (!savedEmail) {
        console.log('⚠️ No saved email found')
        return null
      }
      
      return await findUserByEmail(savedEmail)
    } catch (error) {
      console.error('❌ Error getting current user:', error)
      return null
    }
  }

  // Функция для загрузки данных пользователя
  const loadUserData = async () => {
    try {
      console.log('👤 Loading current user data...')
      const savedEmail = await getUserEmail()
      
      if (!savedEmail) {
        console.log('⚠️ No saved email, user is not logged in')
        setUser(null)
        return null
      }
      
      console.log('📧 Loading data for email:', savedEmail)
      const currentUser = await findUserByEmail(savedEmail)
      
      if (currentUser) {
        console.log('✅ User loaded successfully:', currentUser)
        setUser(currentUser)
        return currentUser
      } else {
        console.log('❌ User not found with email:', savedEmail)
        setUser(null)
        return null
      }
    } catch (error: any) {
      console.error('❌ Error loading user:', error.message)
      setUser(null)
      return null
    }
  }

  // Функция для обновления данных пользователя
  const refreshUser = async () => {
    setIsLoadingUser(true)
    await loadUserData()
    setIsLoadingUser(false)
  }

  // Проверка соединения с сервером
  const checkConnection = async () => {
    setIsCheckingConnection(true)
    const status = await checkServerConnection()
    setServerStatus(status)
    setIsCheckingConnection(false)
    
    if (!status.success) {
      console.error('⚠️ Cannot connect to server:', status.message)
    }
  }

  // Инициализация при загрузке
  useEffect(() => {
    const init = async () => {
      console.log('🚀 AuthProvider initialization started')
      
      await checkConnection()
      
      const savedEmail = await getUserEmail()
      console.log('📧 Saved email on startup:', savedEmail)
      
      if (savedEmail) {
        await loadUserData()
      } else {
        console.log('👤 No saved email, skipping user load')
        setUser(null)
      }
      
      setIsLoadingUser(false)
      console.log('🏁 AuthProvider initialization complete')
    }
    
    init()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login...')
      
      // Логинимся
      await api.post('/accounts/login/', { email, password })
      console.log('✅ Login successful')
      
      // Сохраняем email
      await saveUserEmail(email)
      
      // Загружаем данные пользователя
      await loadUserData()
      return null
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      return extractErrorMessage(error)
    }
  }

  const signUp = async (data: SignUpData) => {
    try {
      console.log('📝 Attempting registration...')
      
      // Регистрация
      await api.post('/accounts/register/', {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        password1: data.password1,
        password2: data.password2,
      })
      console.log('✅ Registration successful')
      
      // Автоматический логин
      await api.post('/accounts/login/', {
        email: data.email,
        password: data.password1,
      })
      
      // Сохраняем email
      await saveUserEmail(data.email)
      
      // Загружаем данные пользователя
      await loadUserData()
      return null
    } catch (error: any) {
      console.error('❌ Registration failed:', error)
      return extractErrorMessage(error)
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Logging out...')
      await api.post('/accounts/logout/')
      console.log('✅ Logout successful')
    } catch (error: any) {
      console.error('❌ Logout error:', error)
    } finally {
      // Очищаем сохраненный email
      await clearUserEmail()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoadingUser, 
        isCheckingConnection,
        serverStatus,
        signIn, 
        signUp, 
        signOut,
        checkConnection,
        refreshUser,
        getCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}