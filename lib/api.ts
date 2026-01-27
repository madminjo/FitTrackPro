import axios, { AxiosError } from 'axios'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Интерфейс для ответа сервера
interface ServerError {
	detail?: string
	email?: string[]
	password?: string[]
	non_field_errors?: string[]
	[key: string]: any
}

// Интерфейс для пользователя
export interface User {
	id: number
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

// ========== НАСТРОЙКА БАЗОВОГО URL ==========
const getBaseURL = () => {
	// Для отладки можно принудительно задать URL
	const FORCE_URL = null // Например: 'http://192.168.1.100:8000/api/v1'

	if (FORCE_URL) {
		console.log('🌐 Using forced URL:', FORCE_URL)
		return FORCE_URL
	}

	if (__DEV__) {
		console.log('🔄 Platform:', Platform.OS)

		switch (Platform.OS) {
			case 'android':
				// Android эмулятор
				const androidURL = 'http://10.0.2.2:8000/api/v1'
				console.log('🤖 Android URL:', androidURL)
				return androidURL

			case 'ios':
				// Для физического iPhone или симулятора
				if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
					// Проверяем, работает ли localhost (для симулятора)
					// Для физического устройства - используем IP компьютера
					const isSimulator = Platform.isTesting || __DEV__

					if (isSimulator) {
						// iOS симулятор
						const iosURL = 'http://localhost:8000/api/v1'
						console.log('🍏 iOS Simulator URL:', iosURL)
						return iosURL
					} else {
						// Физический iPhone - НУЖНО ЗАМЕНИТЬ НА ВАШ IP
						const deviceURL = 'http://192.168.1.100:8000/api/v1'
						console.log('📱 Physical iPhone URL:', deviceURL)
						return deviceURL
					}
				}
			case 'web':
				// Web версия
				const webURL = 'http://localhost:8000/api/v1'
				console.log('🌍 Web URL:', webURL)
				return webURL

			default:
				// Для физических устройств - НУЖНО ЗАМЕНИТЬ НА ВАШ IP
				const deviceURL = 'http://YOUR_COMPUTER_IP:8000/api/v1'
				console.log('📱 Device URL (change this!):', deviceURL)
				return deviceURL
		}
	}

	// Для продакшена
	const prodURL = 'https://your-domain.com/api/v1'
	console.log('🚀 Production URL:', prodURL)
	return prodURL
}

// ========== СОЗДАНИЕ AXIOS ИНСТАНСА ==========
export const api = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	timeout: 10000,
})

// ========== ИНТЕРЦЕПТОРЫ ДЛЯ ОТЛАДКИ ==========
if (__DEV__) {
	api.interceptors.request.use(
		config => {
			console.log('🚀 →', config.method?.toUpperCase(), config.url)
			console.log('📦 Data:', config.data)
			console.log('🔑 Headers:', config.headers)
			console.log('🎯 Full URL:', config.baseURL + config.url)
			return config
		},
		error => {
			console.error('❌ Request error:', error)
			return Promise.reject(error)
		},
	)

	api.interceptors.response.use(
		response => {
			console.log('✅ ←', response.status, response.config.url)
			console.log('📥 Response data:', response.data)
			console.log('🍪 Cookies/headers:', response.headers)
			return response
		},
		(error: AxiosError<ServerError>) => {
			console.error('❌ ← Response error:')
			console.error('📛 Status:', error.response?.status)
			console.error('📛 Message:', error.message)
			console.error('📛 Code:', error.code)
			console.error('📋 Error data:', error.response?.data)
			console.error('🌐 URL:', error.config?.url)
			console.error('📨 Request data:', error.config?.data)

			if (error.response) {
				console.error('📡 Server responded with error')
			} else if (error.request) {
				console.error('📡 No response received')
				console.error('🔗 Request was made to:', error.request._url)
			} else {
				console.error('⚙️ Request setup error')
			}

			return Promise.reject(error)
		},
	)
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Проверка соединения с сервером
 */
export const checkServerConnection = async (): Promise<{
	success: boolean
	message: string
	url?: string
}> => {
	const url = getBaseURL()
	console.log('🔍 Testing connection to:', url)

	try {
		const testApi = axios.create({
			baseURL: url.replace('/api/v1', ''),
			timeout: 5000,
		})

		const response = await testApi.get('/')
		console.log('✅ Server is reachable')
		return {
			success: true,
			message: 'Server is reachable',
			url: url,
		}
	} catch (error: any) {
		console.error('❌ Server connection failed')

		let message = 'Unknown error'

		if (error.code === 'ECONNREFUSED') {
			message = 'Server is not running or port is blocked'
		} else if (error.code === 'ENETUNREACH') {
			message = 'Network is unreachable'
		} else if (error.code === 'ETIMEDOUT') {
			message = 'Connection timeout'
		} else if (error.response) {
			message = `Server responded with: ${error.response.status}`
		} else if (error.request) {
			message = 'No response received from server'
		} else {
			message = error.message || 'Unknown error'
		}

		return {
			success: false,
			message: message,
			url: url,
		}
	}
}

/**
 * Сохраняем email пользователя
 */
export const saveUserEmail = async (email: string): Promise<void> => {
	await AsyncStorage.setItem('userEmail', email)
	console.log('💾 Email saved:', email)
}

/**
 * Получаем сохраненный email
 */
export const getUserEmail = async (): Promise<string | null> => {
	const email = await AsyncStorage.getItem('userEmail')
	console.log('📧 Retrieved email:', email)
	return email
}

/**
 * Удаляем сохраненный email
 */
export const clearUserEmail = async (): Promise<void> => {
	await AsyncStorage.removeItem('userEmail')
	console.log('🗑️ Email cleared')
}

/**
 * Извлечение сообщения об ошибке
 */
export const extractErrorMessage = (error: AxiosError<ServerError>): string => {
	if (!error.response?.data) {
		return error.message || 'Unknown error'
	}

	const data = error.response.data

	if (typeof data === 'string') {
		return data
	}

	if (data.detail) {
		return data.detail
	}

	if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
		return data.non_field_errors[0]
	}

	const firstKey = Object.keys(data)[0]
	if (firstKey) {
		const firstError = data[firstKey]
		if (Array.isArray(firstError)) {
			return firstError[0]
		}
		if (typeof firstError === 'string') {
			return firstError
		}
	}

	if (error.response.status === 400) {
		return 'Bad request. Please check your data.'
	}
	if (error.response.status === 401) {
		return 'Authentication required.'
	}
	if (error.response.status === 403) {
		return 'Access forbidden.'
	}
	if (error.response.status === 404) {
		return 'Resource not found.'
	}
	if (error.response.status >= 500) {
		return 'Server error. Please try again later.'
	}

	return 'An error occurred. Please try again.'
}

export default api
