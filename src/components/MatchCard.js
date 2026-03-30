import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MatchCard = ({ match, onPress, index }) => {
    const { colors, theme } = useTheme();
    const date = new Date(match.date).toLocaleDateString();

    const type = match.type || 'Turf';
    const isTurf = type === 'Turf';
    const goals = match.goals || 0;
    const assists = match.assists || 0;
    const rating = match.rating || '-';

    const opponentImage = match.opponentTeamImage;

    return (
        <View>
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
                onPress={onPress}
            >
                <View style={[styles.typeIndicator, { backgroundColor: isTurf ? colors.primary : colors.accent }]} />
                {opponentImage && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: opponentImage }} style={styles.teamImage} />
                    </View>
                )}
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.date, { color: colors.secondary }]}>{date}</Text>
                        <Text style={[styles.type, { color: colors.text }]}>{type} • {match.format || 'Standard'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.position, { color: colors.secondary }]}>{match.position || 'Player'} • {match.duration || 90}m</Text>
                        <Text style={[styles.opponentName, { color: colors.primary }]}>{match.opponent}</Text>
                    </View>
                    <View style={styles.stats}>
                        <Text style={[styles.statText, { color: colors.text }]}>⚽ {goals}</Text>
                        <Text style={[styles.statText, { color: colors.text }]}>👟 {assists}</Text>
                        <Text style={[styles.rating, { color: colors.accent }]}>★ {rating}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginVertical: 8,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        borderWidth: 1,
    },
    typeIndicator: {
        width: 6,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        fontWeight: '600',
    },
    type: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        marginBottom: 10,
    },
    position: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 2,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 15,
    },
    rating: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    imageContainer: {
        justifyContent: 'center',
        paddingLeft: 12,
    },
    teamImage: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },
    opponentName: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 2,
    },
});

export default MatchCard;
