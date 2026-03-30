import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const LocationSearch = ({ onLocationSelect, initialValue = '' }) => {
    const { colors, theme } = useTheme();
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const fetchSuggestions = async (text) => {
        setQuery(text);
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // countrycodes=in restricts to India
            // viewbox=75.7,22.85,76.0,22.6 & bounded=1 biases/restricts to Indore area
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1&countrycodes=in&viewbox=75.7,22.85,76.0,22.6`,
                {
                    headers: {
                        'User-Agent': 'MatchRecorderApp/1.0'
                    }
                }
            );
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Location Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        const address = item.display_name;
        setQuery(address);
        setSuggestions([]);
        setShowSuggestions(false);
        onLocationSelect(address);
    };

    const getCurrentLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (reverseGeocode.length > 0) {
                const addr = reverseGeocode[0];
                const fullAddr = `${addr.name || ''}, ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.replace(/^, |, $/g, '').replace(/, ,/g, ',');
                setQuery(fullAddr);
                onLocationSelect(fullAddr);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.searchWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.icon} />
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Search Indore & India..."
                    placeholderTextColor={colors.secondary}
                    value={query}
                    onChangeText={fetchSuggestions}
                    onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                />
                {loading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.rightIcon} />
                ) : (
                    <TouchableOpacity onPress={getCurrentLocation} style={styles.rightIcon}>
                        <Ionicons name="navigate-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.place_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                                onPress={() => handleSelect(item)}
                            >
                                <Ionicons name="map-outline" size={16} color={colors.secondary} />
                                <Text style={[styles.suggestionText, { color: colors.text }]} numberOfLines={2}>
                                    {item.display_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', position: 'relative' },
    searchWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, height: 50 },
    icon: { paddingHorizontal: 15 },
    input: { flex: 1, fontSize: 14 },
    rightIcon: { paddingHorizontal: 15 },
    suggestionsContainer: { position: 'absolute', top: 55, left: 0, right: 0, borderRadius: 12, borderWidth: 1, elevation: 5, zIndex: 9999, maxHeight: 200 },
    suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
    suggestionText: { flex: 1, marginLeft: 10, fontSize: 13 },
});

export default LocationSearch;
