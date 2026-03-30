import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SignupScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const { signup } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signup(username.trim(), password.trim(), email.trim());
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, icon, placeholder, value, onChangeText, secureTextEntry, isPassword, showPassword, togglePassword, keyboardType }) => (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <Ionicons name={icon} size={20} color={colors.secondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondary}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                />
                {isPassword && (
                    <TouchableOpacity onPress={togglePassword} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.bg }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        {/* Logo Area */}
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                        </View>

                        <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.secondary }]}>Join the team today</Text>

                        <InputField 
                            label="Username" 
                            icon="person-outline" 
                            placeholder="Choose a username" 
                            value={username} 
                            onChangeText={setUsername} 
                        />

                        <InputField 
                            label="Email Address" 
                            icon="mail-outline" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address"
                        />

                        <InputField 
                            label="Password" 
                            icon="lock-closed-outline" 
                            placeholder="Create a password" 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry={!isPasswordVisible}
                            isPassword
                            showPassword={isPasswordVisible}
                            togglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
                        />

                        <InputField 
                            label="Confirm Password" 
                            icon="lock-closed-outline" 
                            placeholder="Confirm your password" 
                            value={confirmPassword} 
                            onChangeText={setConfirmPassword} 
                            secureTextEntry={!isConfirmPasswordVisible}
                            isPassword
                            showPassword={isConfirmPasswordVisible}
                            togglePassword={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        />

                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleSignup} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.secondary }]}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.link, { color: colors.primary }]}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    formContainer: { padding: 30, borderRadius: 24, borderWidth: 1, elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    logoContainer: { alignItems: 'center', marginBottom: 20 },
    logoImage: { width: 90, height: 90 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 25 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    inputIcon: { paddingLeft: 15 },
    input: { flex: 1, padding: 14, fontSize: 16 },
    eyeIcon: { padding: 14 },
    button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonIcon: { marginLeft: 8 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 14 },
    link: { fontSize: 14, fontWeight: 'bold' },
});

export default SignupScreen;
