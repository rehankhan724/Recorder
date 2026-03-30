import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/welcome_bg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={[
                        theme === 'dark' ? 'rgba(2, 6, 23, 0.4)' : 'rgba(15, 23, 42, 0.3)',
                        theme === 'dark' ? 'rgba(2, 6, 23, 0.95)' : 'rgba(79, 70, 229, 0.95)'
                    ]}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.content}>
                            {/* Top Section: App Name & Logo */}
                            <View style={styles.header}>
                                <View style={styles.logoCircle}>
                                    <Ionicons name="football" size={40} color="#fff" />
                                </View>
                                <Text style={styles.appName}>MATCH RECORDER</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Middle Section: Hero Text */}
                            <View style={styles.heroSection}>
                                <Text style={styles.title}>
                                    Every Match{"\n"}<Text style={styles.highlight}>Counts.</Text>
                                </Text>
                                <Text style={styles.subtitle}>
                                    The professional way to track your performance, goals, and growth in Indore's football scene.
                                </Text>
                            </View>

                            {/* Bottom Section: Actions */}
                            <View style={styles.actionSection}>
                                <View>
                                    <TouchableOpacity
                                        style={styles.getStartedButton}
                                        onPress={() => navigation.navigate('Login')}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>Get Started Now</Text>
                                        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => navigation.navigate('Signup')}
                                    >
                                        <Text style={styles.secondaryButtonText}>Create New Account</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <Text style={styles.versionText}>v2.0 Premium Edition</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { width: '100%', height: '100%' },
    gradient: { flex: 1 },
    safeArea: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 30, justifyContent: 'space-between', paddingTop: height * 0.08, paddingBottom: height * 0.05 },
    header: { alignItems: 'center' },
    logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.5)', marginBottom: 15 },
    appName: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 4 },
    divider: { width: 40, height: 3, backgroundColor: '#F59E0B', marginTop: 10, borderRadius: 2 },
    heroSection: { marginTop: height * 0.05 },
    title: { color: '#fff', fontSize: 48, fontWeight: '950', lineHeight: 56 },
    highlight: { color: '#F59E0B' },
    subtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, marginTop: 20, lineHeight: 24, paddingRight: 40 },
    actionSection: { gap: 15 },
    getStartedButton: { backgroundColor: '#fff', paddingVertical: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
    buttonText: { color: '#4F46E5', fontSize: 18, fontWeight: 'bold' },
    secondaryButton: { paddingVertical: 12, alignItems: 'center' },
    secondaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
    versionText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 10, textAlign: 'center', marginTop: 10, fontWeight: 'bold', letterSpacing: 1 },
});

export default WelcomeScreen;
