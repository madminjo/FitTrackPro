import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

function RouteGuard({ children }: { children: React.ReactNode }) {
	const { user, isLoadingUser } = useAuth()
	const segments = useSegments()
	const router = useRouter()

	useEffect(() => {
		if (isLoadingUser) return

		const inAuthGroup = segments[0] === '(auth)'

		if (!user && !inAuthGroup) {
			router.replace('/(auth)')
		}

		if (user && inAuthGroup) {
			router.replace('/(tabs)')
		}
	}, [user, isLoadingUser, segments])

	return <>{children}</>
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<PaperProvider>
				<SafeAreaProvider>
					<RouteGuard>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(auth)" />
							<Stack.Screen name="(tabs)" />
						</Stack>
					</RouteGuard>
				</SafeAreaProvider>
			</PaperProvider>
		</AuthProvider>
	)
}
