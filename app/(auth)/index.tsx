import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'
import {
  Button,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()
  const {
    signIn,
    signUp,

  } = useAuth()



  const handleAuth = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // Валидация
      if (!email) {
        setError('Email is required')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email')
        return
      }

      if (isSignUp) {
        // Валидация для регистрации
        if (!firstName || !lastName || !phoneNumber || !password1 || !password2) {
          setError('Please fill all fields')
          return
        }

        if (password1 !== password2) {
          setError('Passwords do not match')
          return
        }

        if (password1.length < 6) {
          setError('Password must be at least 6 characters')
          return
        }

        const err = await signUp({
          email,
          password1,
          password2,
          firstName,
          lastName,
          phoneNumber
        })

        if (err) setError(err)
      } else {
        // Валидация для входа
        if (!password1) {
          setError('Password is required')
          return
        }

        const err = await signIn(email, password1)
        if (err) setError(err)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearForm = () => {
    setEmail('')
    setPassword1('')
    setPassword2('')
    setFirstName('')
    setLastName('')
    setPhoneNumber('')
    setError(null)
  }

  const toggleAuthMode = () => {
    clearForm()
    setIsSignUp(p => !p)  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>


          <Text variant="headlineMedium" style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>

          {/* Поля для регистрации */}
          {isSignUp && (
            <>
              <TextInput
                label="First Name"
                mode="outlined"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                label="Last Name"
                mode="outlined"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                label="Phone Number"
                mode="outlined"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                disabled={isLoading}
                style={styles.input}
              />
            </>
          )}

          {/* Email */}
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            disabled={isLoading}
            style={styles.input}
          />

          {/* Пароль */}
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password1}
            onChangeText={setPassword1}
            disabled={isLoading}
            style={[styles.input, !isSignUp && styles.lastInput]}
          />

          {/* Подтверждение пароля */}
          {isSignUp && (
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry
              value={password2}
              onChangeText={setPassword2}
              disabled={isLoading}
              style={styles.lastInput}
            />
          )}

          {/* Ошибка */}
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={20} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
          )}

          {/* Кнопка входа/регистрации */}
          <Button
            mode="contained"
            onPress={handleAuth}
            loading={isLoading}
            disabled={
              isLoading ||
              (isSignUp
                ? !email || !password1 || !password2 || !firstName || !lastName || !phoneNumber
                : !email || !password1)
            }
            style={styles.authButton}
            contentStyle={styles.authButtonContent}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          {/* Переключение режима */}
          <Button
            mode="text"
            onPress={toggleAuthMode}
            disabled={isLoading}
            style={styles.switchButton}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusCard: {
    marginBottom: 20,
    borderRadius: 8,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    marginLeft: 12,
  },
  statusMessage: {
    color: 'gray',
    marginTop: 2,
  },
  statusUrl: {
    color: 'blue',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  lastInput: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
  },
  authButton: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  authButtonContent: {
    paddingVertical: 8,
  },
  switchButton: {
    marginTop: 16,
  },
  debugButton: {
    marginTop: 12,
    borderColor: '#6200ee',
  },
  ipHint: {
    textAlign: 'center',
    marginTop: 24,
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic',
  },
})