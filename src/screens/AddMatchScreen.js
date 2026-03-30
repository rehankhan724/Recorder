import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenWrapper from '../components/ScreenWrapper';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { saveMatch, updateMatch } from '../utils/storage';
import LocationSearch from '../components/LocationSearch';
import { useTheme } from '../context/ThemeContext';

const POSITIONS = ['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'SUB'];

const FORMATS = {
    'Turf': ['5 Side', '6 Side', '7 Side', '9 Side'],
    'Ground': ['11 Side', '8 Side', '7 Side', '6 Side', '5 Side']
};

const AddMatchScreen = ({ navigation, route }) => {
    const { colors, theme } = useTheme();
    
    // Check if we are editing
    const editingMatch = route.params?.match;
    const isEditing = !!editingMatch;

    const [opponent, setOpponent] = useState('');
    const [myScore, setMyScore] = useState('');
    const [opponentScore, setOpponentScore] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dynamic Fields
    const [type, setType] = useState('Turf');
    const [format, setFormat] = useState('5 Side');
    const [goals, setGoals] = useState('');
    const [assists, setAssists] = useState('');
    const [rating, setRating] = useState('');
    const [duration, setDuration] = useState('');
    const [position, setPosition] = useState('');
    const [myTeamImage, setMyTeamImage] = useState(null);
    const [opponentTeamImage, setOpponentTeamImage] = useState(null);
    const [matchPhotos, setMatchPhotos] = useState([]);
    const [matchVideos, setMatchVideos] = useState([]);

    // Pre-fill data if editing
    useEffect(() => {
        if (isEditing) {
            setOpponent(editingMatch.opponent);
            setMyScore(String(editingMatch.myScore));
            setOpponentScore(String(editingMatch.opponentScore));
            setLocation(editingMatch.location);
            setNotes(editingMatch.notes);
            setDate(new Date(editingMatch.date));
            setType(editingMatch.type || 'Turf');
            setFormat(editingMatch.format || '5 Side');
            setGoals(String(editingMatch.goals || 0));
            setAssists(String(editingMatch.assists || 0));
            setRating(String(editingMatch.rating || ''));
            setDuration(String(editingMatch.duration || 90));
            setPosition(editingMatch.position || '');
            setMyTeamImage(editingMatch.myTeamImage || null);
            setOpponentTeamImage(editingMatch.opponentTeamImage || null);
            setMatchPhotos(editingMatch.matchPhotos || []);
            setMatchVideos(editingMatch.matchVideos || []);

            navigation.setOptions({ title: 'Edit Match Record' });
        }
    }, [isEditing, editingMatch, navigation]);

    // Update Default Format when Type changes
    useEffect(() => {
        if (!isEditing || (isEditing && type !== editingMatch.type)) {
            if (type === 'Turf' && !FORMATS['Turf'].includes(format)) {
                setFormat('5 Side');
            } else if (type === 'Ground' && !FORMATS['Ground'].includes(format)) {
                setFormat('11 Side');
            }
        }
    }, [type]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const pickTeamImage = async (isMyTeam) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            if (isMyTeam) setMyTeamImage(result.assets[0].uri);
            else setOpponentTeamImage(result.assets[0].uri);
        }
    };

    const pickVideos = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsMultipleSelection: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const newVideos = result.assets.map(asset => asset.uri);
            setMatchVideos([...matchVideos, ...newVideos]);
        }
    };

    const pickPhotos = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const newPhotos = result.assets.map(asset => asset.uri);
            setMatchPhotos([...matchPhotos, ...newPhotos]);
        }
    };

    const removeMedia = (index, mediaType) => {
        if (mediaType === 'photo') {
            const updated = [...matchPhotos];
            updated.splice(index, 1);
            setMatchPhotos(updated);
        } else if (mediaType === 'video') {
            const updated = [...matchVideos];
            updated.splice(index, 1);
            setMatchVideos(updated);
        }
    };

    const clearTeamImage = (isMyTeam) => {
        if (isMyTeam) setMyTeamImage(null);
        else setOpponentTeamImage(null);
    };

    const getResult = () => {
        const my = parseInt(myScore);
        const opp = parseInt(opponentScore);
        if (isNaN(my) || isNaN(opp)) return 'Pending';
        if (my > opp) return 'Win';
        if (my < opp) return 'Loss';
        return 'Draw';
    };

    const handleSave = async () => {
        if (!opponent || !myScore || !opponentScore) {
            Alert.alert('Error', 'Please fill in required fields (Opponent, Scores).');
            return;
        }

        const ratingNum = parseFloat(rating);
        if (rating && (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)) {
            Alert.alert('Error', 'Rating must be between 0 and 10.');
            return;
        }

        setLoading(true);
        try {
            const matchData = {
                opponent,
                myScore: parseInt(myScore) || 0,
                opponentScore: parseInt(opponentScore) || 0,
                result: getResult(),
                location: location || 'Unknown',
                date: date.toISOString(),
                notes,
                type,
                format,
                goals: parseInt(goals) || 0,
                assists: parseInt(assists) || 0,
                rating: ratingNum || 0,
                duration: parseInt(duration) || 90,
                position: position || 'Player',
                myTeamImage,
                opponentTeamImage,
                matchPhotos,
                matchVideos,
            };

            if (isEditing) {
                await updateMatch({ ...editingMatch, ...matchData });
                Alert.alert('Success', 'Match updated!', [{ text: 'OK', onPress: () => navigation.navigate('History') }]);
            } else {
                await saveMatch(matchData);
                Alert.alert('Success', 'Match recorded!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save match. ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={[styles.headerTitle, { color: colors.primary }]}>{isEditing ? 'Edit Record' : 'Record Match'}</Text>

                {/* Match Type & Format */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Match Type</Text>
                    <View style={styles.typeRow}>
                        {['Turf', 'Ground'].map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeButton, { borderColor: colors.primary, backgroundColor: type === t ? colors.primary : colors.card }]}
                                onPress={() => setType(t)}
                            >
                                <Text style={[styles.typeText, { color: type === t ? '#fff' : colors.primary }]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Game Format</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                        {FORMATS[type].map((fmt) => (
                            <TouchableOpacity
                                key={fmt}
                                style={[styles.chip, { backgroundColor: format === fmt ? colors.primary : colors.card, borderColor: format === fmt ? colors.primary : colors.border }]}
                                onPress={() => setFormat(fmt)}
                            >
                                <Text style={[styles.chipText, { color: format === fmt ? '#fff' : colors.text }]}>{fmt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Opponent Info */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Opponent Name *</Text>
                    <AppInput
                        placeholder="e.g. Red Stars FC"
                        value={opponent}
                        onChangeText={setOpponent}
                    />
                </View>

                {/* Team Badges */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Team Badges</Text>
                    <View style={styles.imageRow}>
                        <View style={styles.imagePickerContainer}>
                            <TouchableOpacity style={[styles.imagePicker, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => pickTeamImage(true)}>
                                {myTeamImage ? (
                                    <Image source={{ uri: myTeamImage }} style={styles.teamImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Text style={[styles.imagePlaceholderText, { color: colors.secondary }]}>My Team</Text>
                                        <Ionicons name="add" size={24} color={colors.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {myTeamImage && (
                                <TouchableOpacity style={styles.deleteBadge} onPress={() => clearTeamImage(true)}>
                                    <MaterialCommunityIcons name="close-circle" size={24} color={colors.danger} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={[styles.vsText, { color: colors.secondary }]}>VS</Text>

                        <View style={styles.imagePickerContainer}>
                            <TouchableOpacity style={[styles.imagePicker, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => pickTeamImage(false)}>
                                {opponentTeamImage ? (
                                    <Image source={{ uri: opponentTeamImage }} style={styles.teamImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Text style={[styles.imagePlaceholderText, { color: colors.secondary }]}>Opponent</Text>
                                        <Ionicons name="add" size={24} color={colors.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {opponentTeamImage && (
                                <TouchableOpacity style={styles.deleteBadge} onPress={() => clearTeamImage(false)}>
                                    <MaterialCommunityIcons name="close-circle" size={24} color={colors.danger} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Media Gallery */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Match Gallery (Photos)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaGallery}>
                        <TouchableOpacity style={[styles.addMediaSmall, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={pickPhotos}>
                            <Ionicons name="camera" size={24} color={colors.primary} />
                            <Text style={styles.addMediaText}>Add</Text>
                        </TouchableOpacity>
                        {matchPhotos.map((uri, index) => (
                            <View key={index} style={styles.mediaItemContainer}>
                                <Image source={{ uri }} style={styles.mediaPreviewSmall} />
                                <TouchableOpacity style={styles.deleteBadgeSmall} onPress={() => removeMedia(index, 'photo')}>
                                    <Ionicons name="close-circle" size={18} color={colors.danger} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Score & Timing */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: colors.text }]}>My Score *</Text>
                        <AppInput placeholder="0" value={myScore} onChangeText={setMyScore} keyboardType="numeric" />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Opponent Score *</Text>
                        <AppInput placeholder="0" value={opponentScore} onChangeText={setOpponentScore} keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.dateText, { color: colors.text }]}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
                        )}
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Duration (min)</Text>
                        <AppInput placeholder="90" value={duration} onChangeText={setDuration} keyboardType="numeric" />
                    </View>
                </View>

                {/* Position */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Your Position</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                        {POSITIONS.map((pos) => (
                            <TouchableOpacity
                                key={pos}
                                style={[styles.chip, { backgroundColor: position === pos ? colors.secondary : colors.card, borderColor: position === pos ? colors.secondary : colors.border }]}
                                onPress={() => setPosition(pos)}
                            >
                                <Text style={[styles.chipText, { color: position === pos ? '#fff' : colors.text }]}>{pos}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Location Search */}
                <View style={[styles.formGroup, { zIndex: 1000 }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Match Location *</Text>
                    <LocationSearch onLocationSelect={(addr) => setLocation(addr)} initialValue={location} />
                </View>

                {/* Personal Stats */}
                <Text style={[styles.sectionHeader, { color: colors.secondary }]}>Personal Performance</Text>
                <View style={styles.statsRow}>
                    <View style={styles.thirdInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Goals</Text>
                        <AppInput placeholder="0" value={goals} onChangeText={setGoals} keyboardType="numeric" />
                    </View>
                    <View style={styles.thirdInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Assists</Text>
                        <AppInput placeholder="0" value={assists} onChangeText={setAssists} keyboardType="numeric" />
                    </View>
                    <View style={styles.thirdInput}>
                        <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
                        <AppInput placeholder="1-10" value={rating} onChangeText={setRating} keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
                    <AppInput placeholder="Match details..." value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
                </View>

                <View style={styles.footer}>
                    <AppButton title={loading ? "Saving..." : (isEditing ? "Update Entry" : "Record Match")} onPress={handleSave} disabled={loading} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 60 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 13, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    halfInput: { width: '48%' },
    thirdInput: { width: '31%' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10, letterSpacing: 0.5 },
    dateButton: { padding: 14, borderRadius: 12, borderWidth: 1 },
    dateText: { fontSize: 16, fontWeight: '500' },
    typeRow: { flexDirection: 'row', gap: 10 },
    typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    typeText: { fontSize: 14, fontWeight: '700' },
    chipsScroll: { flexDirection: 'row' },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 8 },
    chipText: { fontSize: 13, fontWeight: '600' },
    imageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    imagePicker: { width: 90, height: 90, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    teamImage: { width: '100%', height: '100%' },
    imagePlaceholder: { alignItems: 'center' },
    imagePlaceholderText: { fontSize: 10, marginBottom: 4, fontWeight: 'bold' },
    vsText: { fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' },
    imagePickerContainer: { position: 'relative' },
    deleteBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 12 },
    mediaGallery: { flexDirection: 'row', marginTop: 5 },
    addMediaSmall: { width: 80, height: 80, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    addMediaText: { fontSize: 10, color: '#4F46E5', marginTop: 4, fontWeight: 'bold' },
    mediaItemContainer: { position: 'relative', marginRight: 12 },
    mediaPreviewSmall: { width: 80, height: 80, borderRadius: 12 },
    deleteBadgeSmall: { position: 'absolute', top: -6, right: -6, backgroundColor: '#fff', borderRadius: 9 },
    footer: { marginTop: 30 },
});

export default AddMatchScreen;
