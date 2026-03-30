import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

import { getMatches } from '../utils/storage';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [stats, setStats] = useState({ total: 0, wins: 0, goals: 0 });
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
    const [deviceName, setDeviceName] = useState('Unknown Device');
    const { logout, user } = useContext(AuthContext);
    const { colors, theme, toggleTheme } = useTheme();

    useEffect(() => {
        const name = Device.modelName || Device.productName || Device.designName || 'Player Device';
        setDeviceName(name);
    }, []);

    const fetchStats = async () => {
        const matches = await getMatches();
        const total = matches.length;
        const wins = matches.filter(m => m.result === 'Win').length;
        const goals = matches.reduce((acc, m) => acc + (parseInt(m.goals) || 0), 0);
        
        // Prepare chart data (last 5 matches goals)
        const last5 = matches.slice(0, 5).reverse().map(m => parseInt(m.goals) || 0);
        if (last5.length > 0) setChartData(last5);

        setStats({ total, wins, goals });
    };

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [])
    );

    const MenuCard = ({ title, icon, subtitle, color, onPress, index }) => (
        <View>
            <TouchableOpacity
                style={[styles.menuCard, { backgroundColor: colors.card }]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <View style={styles.menuCardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: color }]}>
                        <Ionicons name={icon} size={28} color={theme === 'dark' ? '#000' : '#fff'} />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
                        <Text style={[styles.menuSubtitle, { color: colors.secondary }]}>{subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const BadgeItem = ({ icon, label, threshold, value, color }) => {
        const isUnlocked = value >= threshold;
        return (
            <View style={styles.badgeItem}>
                <View style={[styles.badgeCircle, { borderStyle: isUnlocked ? 'solid' : 'dashed', borderColor: isUnlocked ? color : colors.gray }]}>
                    <Ionicons name={icon} size={24} color={isUnlocked ? color : colors.gray} />
                </View>
                <Text style={[styles.badgeLabel, { color: colors.text }]}>{label}</Text>
                {!isUnlocked && <Text style={styles.badgeProgress}>{value}/{threshold}</Text>}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Header */}
                <ImageBackground
                    source={require('../../assets/welcome_bg.png')}
                    style={styles.hero}
                >
                    <LinearGradient
                        colors={[theme === 'dark' ? 'rgba(2, 6, 23, 0.7)' : 'rgba(15, 23, 42, 0.4)', colors.primary]}
                        style={styles.heroGradient}
                    >
                        <SafeAreaView>
                            <View style={styles.header}>
                                <View>
                                    <Text style={styles.greeting}>Good Day, {user?.username || 'Player'}</Text>
                                    <Text style={styles.appName}>Match Hub</Text>
                                </View>
                                <View style={styles.headerRight}>
                                    <TouchableOpacity style={[styles.headerIcon, { marginRight: 10 }]} onPress={toggleTheme}>
                                        <Ionicons name={theme === 'dark' ? "sunny" : "moon"} size={22} color={colors.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.avatar} onPress={logout}>
                                        <Ionicons name="football" size={32} color={colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Stats Card */}
                            <View style={[styles.mainStatsCard, { backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.2)' }]}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statPrefix}>Total</Text>
                                    <Text style={styles.statValue}>{stats.total}</Text>
                                    <Text style={styles.statUnit}>PLAYED</Text>
                                </View>
                                <View style={styles.statSeparator} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statPrefix}>Victory</Text>
                                    <Text style={[styles.statValue, { color: colors.accent }]}>{stats.wins}</Text>
                                    <Text style={styles.statUnit}>MATCHES</Text>
                                </View>
                                <View style={styles.statSeparator} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statPrefix}>Scored</Text>
                                    <Text style={[styles.statValue, { color: colors.highlight }]}>{stats.goals}</Text>
                                    <Text style={styles.statUnit}>GOALS</Text>
                                </View>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                </ImageBackground>

                {/* Content Area */}
                <View style={[styles.content, { backgroundColor: colors.bg }]}>
                    
                    {/* Goal Trend Chart */}
                    <View>
                        <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Goal Trend (Last 5)</Text>
                        <LineChart
                            data={{
                                labels: [],
                                datasets: [{ data: chartData }]
                            }}
                            width={width - 40}
                            height={180}
                            chartConfig={{
                                backgroundColor: colors.card,
                                backgroundGradientFrom: colors.card,
                                backgroundGradientTo: colors.card,
                                decimalPlaces: 0,
                                color: (opacity = 1) => theme === 'dark' ? `rgba(99, 102, 241, ${opacity})` : `rgba(79, 70, 229, ${opacity})`,
                                labelColor: (opacity = 1) => colors.secondary,
                                style: { borderRadius: 16 },
                                propsForDots: { r: "5", strokeWidth: "2", stroke: colors.primary }
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
                    </View>
                    
                    <View style={[styles.badgesContainer, { backgroundColor: colors.card }]}>
                        <BadgeItem icon="trophy" label="Champion" threshold={5} value={stats.wins} color="#FBBF24" />
                        <BadgeItem icon="football" label="Scorer" threshold={10} value={stats.goals} color="#10B981" />
                        <BadgeItem icon="medal" label="Veteran" threshold={10} value={stats.total} color="#6366F1" />
                        <BadgeItem icon="shield-checkmark" label="Safe" threshold={3} value={stats.wins} color="#EF4444" />
                    </View>

                    <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
                    </View>

                    <MenuCard
                        index={1}
                        title="Record Match"
                        subtitle="Log matches & location"
                        icon="add"
                        color={colors.primary}
                        onPress={() => navigation.navigate('AddMatch')}
                    />

                    <MenuCard
                        index={2}
                        title="History"
                        subtitle="Analyze tracks"
                        icon="stats-chart"
                        color={colors.accent}
                        onPress={() => navigation.navigate('History')}
                    />

                    <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }]} onPress={logout}>
                        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    hero: { width: '100%', height: height * 0.42 },
    heroGradient: { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 0 : 20, justifyContent: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    headerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    appName: { fontSize: 30, fontWeight: '950', color: '#fff', letterSpacing: 1 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
    mainStatsCard: { borderRadius: 24, padding: 22, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statItem: { alignItems: 'center' },
    statPrefix: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
    statValue: { fontSize: 26, fontWeight: '900', color: '#fff' },
    statUnit: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', marginTop: 2 },
    statSeparator: { width: 1, height: 35, backgroundColor: 'rgba(255,255,255,0.2)' },
    content: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingHorizontal: 20, paddingTop: 30, paddingBottom: 40 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    menuCard: { marginBottom: 12, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    menuCardContent: { flexDirection: 'row', alignItems: 'center', padding: 14 },
    iconContainer: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuTextContainer: { flex: 1 },
    menuTitle: { fontSize: 16, fontWeight: 'bold' },
    menuSubtitle: { fontSize: 12 },
    chart: { borderRadius: 20, marginVertical: 8 },
    badgesContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderRadius: 20, marginBottom: 20 },
    badgeItem: { alignItems: 'center' },
    badgeCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
    badgeLabel: { fontSize: 10, fontWeight: 'bold' },
    badgeProgress: { fontSize: 8, color: '#94A3B8' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 16, marginTop: 10 },
    logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
});

export default HomeScreen;
