import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const POSITIONS_COORDINATES = {
    'GK': { top: '85%', left: '45%' },
    'LB': { top: '65%', left: '15%' },
    'CB': { top: '70%', left: '45%' },
    'RB': { top: '65%', left: '75%' },
    'CDM': { top: '50%', left: '45%' },
    'CM': { top: '40%', left: '45%' },
    'CAM': { top: '25%', left: '45%' },
    'LW': { top: '15%', left: '15%' },
    'RW': { top: '15%', left: '75%' },
    'ST': { top: '10%', left: '45%' },
    'SUB': { top: '90%', left: '85%' },
};

const FieldView = ({ position }) => {
    const { colors, theme } = useTheme();
    const pos = POSITIONS_COORDINATES[position] || POSITIONS_COORDINATES['CM'];

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#064e3b' : '#10b981' }]}>
            {/* Pitch Markings */}
            <View style={styles.outerBorder} />
            <View style={styles.centerLine} />
            <View style={styles.centerCircle} />
            <View style={styles.penaltyAreaTop} />
            <View style={styles.penaltyAreaBottom} />

            {/* Player Marker */}
            <View style={[styles.marker, { top: pos.top, left: pos.left }]}>
                <View style={styles.markerCircle}>
                    <Ionicons name="person" size={16} color="#fff" />
                </View>
                <Text style={styles.markerText}>{position}</Text>
            </View>

            <View style={styles.fieldInfo}>
                <Text style={styles.fieldText}>TACTICAL POSITIONING</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        marginVertical: 15,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    outerBorder: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    centerLine: {
        position: 'absolute',
        top: '50%',
        left: 10,
        right: 10,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    centerCircle: {
        position: 'absolute',
        top: '38%',
        left: '38%',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    penaltyAreaTop: {
        position: 'absolute',
        top: 10,
        left: '25%',
        width: '50%',
        height: 40,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    penaltyAreaBottom: {
        position: 'absolute',
        bottom: 10,
        left: '25%',
        width: '50%',
        height: 40,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    markerCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4F46E5',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    fieldInfo: {
        position: 'absolute',
        bottom: 15,
        left: 20,
    },
    fieldText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default FieldView;
