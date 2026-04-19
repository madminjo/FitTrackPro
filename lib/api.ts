import axios, { AxiosError } from 'axios'
// import { Platform } from 'react-native'

interface ServerError {
	detail?: string
	email?: string[]
	password?: string[]
	non_field_errors?: string[]
	[key: string]: any
}

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


const prodURL = 'http://10.124.2.55:8000/api/v1'
// const prodURL = 'http://127.0.0.1:8000/api/v1'
// const prodURL = 'http://192.168.0.111:8000/api/v1'

// const getBaseURL = () => {
// 	if (Platform.OS === 'android') {
// 		return 'http://10.0.2.2:8000/api/v1' // Для Android
// 	}
// 	return 'http://127.0.0.1:8000/api/v1' // Для iOS и остального
// }
export const api = axios.create({
	baseURL: prodURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	timeout: 10000,
})

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
