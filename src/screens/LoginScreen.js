import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.bg }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView style={styles.content}>
                <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {/* Logo Area */}
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                    </View>

                    <Text style={[styles.title, { color: colors.primary }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.secondary }]}>Sign in to your account</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.secondary }]}>Email Address</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.secondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.secondary }]}>Password</Text>
                        <View style={[styles.passwordContainer, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.secondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>Login</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.secondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.link, { color: colors.primary }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    formContainer: { padding: 30, borderRadius: 24, borderWidth: 1, elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    logoContainer: { alignItems: 'center', marginBottom: 20 },
    logoImage: { width: 100, height: 100 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30 },
    inputContainer: { marginBottom: 18 },
    label: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    inputIcon: { paddingLeft: 15 },
    input: { flex: 1, padding: 14, fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    passwordInput: { flex: 1, padding: 14, fontSize: 16 },
    eyeIcon: { padding: 14 },
    button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonIcon: { marginLeft: 8 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 14 },
    link: { fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
