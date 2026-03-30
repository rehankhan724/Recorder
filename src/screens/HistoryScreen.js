import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import MatchCard from '../components/MatchCard';
import { getMatches } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();
    const [matches, setMatches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchMatches = async () => {
        try {
            const data = await getMatches();
            // Sort by date descending
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMatches(sorted);
        } catch (error) {
            console.error('Error fetching matches:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMatches();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMatches();
    };

    const renderItem = ({ item, index }) => (
        <MatchCard
            index={index}
            match={item}
            onPress={() => navigation.navigate('MatchDetails', { match: item })}
        />
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            {!loading && (
                <>
                    <Text style={[styles.emptyText, { color: colors.secondary }]}>No matches recorded yet.</Text>
                    <Text style={[styles.emptySubText, { color: colors.gray }]}>Go play some football!</Text>
                </>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Match History</Text>
            </View>
            <FlatList
                data={matches}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
                ListEmptyComponent={renderEmptyComponent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
    },
});

export default HistoryScreen;
