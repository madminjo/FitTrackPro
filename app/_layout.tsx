import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

function RouteGrups({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { user, isLoadingUser } = useAuth()
	const segments = useSegments()

	useEffect(() => {
		const inAuthGrup = segments[0] === 'auth'

		if (!user && !inAuthGrup && !isLoadingUser) {
			router.replace('/auth')
		} else if (user && inAuthGrup && !isLoadingUser) {
			router.replace('/')
		}
	}, [user, segments, isLoadingUser, router])

	return <>{children}</>
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<PaperProvider>
				<SafeAreaProvider>
					<RouteGrups>
						<Stack>
							<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						</Stack>
					</RouteGrups>
				</SafeAreaProvider>
			</PaperProvider>
		</AuthProvider>
	)
}
