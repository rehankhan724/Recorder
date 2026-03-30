import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions, Share } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenWrapper from '../components/ScreenWrapper';
import FieldView from '../components/FieldView';
import { deleteMatch } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const MatchDetailsScreen = ({ route, navigation }) => {
    const { match } = route.params;
    const { colors, theme } = useTheme();
    const [activeVideo, setActiveVideo] = useState(null);

    const handleDelete = () => {
        Alert.alert(
            'Delete Match',
            'Are you sure you want to remove this record permanently?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMatch(match.id);
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert('Error', e.message);
                        }
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Match Result: ${match.opponent} vs Me (${match.myScore}-${match.opponentScore})! I scored ${match.goals} goals. Check my stats in Match Recorder!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const InfoCard = ({ icon, label, value, color, delay }) => (
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>{label}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Score Header */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.header}
                >
                    <View style={styles.scoreRow}>
                        <View style={styles.teamContainer}>
                            {match.myTeamImage ? (
                                <Image source={{ uri: match.myTeamImage }} style={styles.teamBadge} />
                            ) : (
                                <View style={styles.badgePlaceholder}><Text style={styles.badgeLetter}>M</Text></View>
                            )}
                            <Text style={styles.teamName}>MY TEAM</Text>
                        </View>

                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>{match.myScore} - {match.opponentScore}</Text>
                            <View style={[styles.resultBadge, { backgroundColor: match.result === 'Win' ? '#10B981' : match.result === 'Loss' ? '#EF4444' : '#64748B' }]}>
                                <Text style={styles.resultText}>{match.result}</Text>
                            </View>
                        </View>

                        <View style={styles.teamContainer}>
                            {match.opponentTeamImage ? (
                                <Image source={{ uri: match.opponentTeamImage }} style={styles.teamBadge} />
                            ) : (
                                <View style={styles.badgePlaceholder}><Text style={styles.badgeLetter}>O</Text></View>
                            )}
                            <Text style={styles.teamName}>{match.opponent.substring(0, 10)}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.headerFooter}>
                        <Text style={styles.matchMeta}>{new Date(match.date).toLocaleDateString()} • {match.location}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Performance Section */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Analysis</Text>
                    <View style={styles.infoGrid}>
                        <InfoCard icon="football" label="Goals" value={match.goals} color="#10B981" delay={100} />
                        <InfoCard icon="walk" label="Assists" value={match.assists} color="#6366F1" delay={200} />
                        <InfoCard icon="star" label="Rating" value={match.rating} color="#FBBF24" delay={300} />
                        <InfoCard icon="timer-outline" label="Mins" value={match.duration} color="#EC4899" delay={400} />
                    </View>

                    {/* Tactical Positioning */}
                    <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 25 }]}>Tactical Positioning</Text>
                    <View>
                        <FieldView position={match.position} />
                    </View>

                    {/* Gallery */}
                    {match.matchPhotos && match.matchPhotos.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Match Photos</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                                {match.matchPhotos.map((uri, index) => (
                                    <Image key={index} source={{ uri }} style={styles.galleryImage} />
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Videos */}
                    {match.matchVideos && match.matchVideos.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Match Highlights</Text>
                            <View style={styles.videoList}>
                                {match.matchVideos.map((uri, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={[styles.videoCard, { backgroundColor: colors.card }]}
                                        onPress={() => setActiveVideo(activeVideo === index ? null : index)}
                                    >
                                        <View style={styles.videoHeader}>
                                            <Ionicons name="play-circle" size={24} color={colors.primary} />
                                            <Text style={[styles.videoTitle, { color: colors.text }]}>Highlight #{index + 1}</Text>
                                        </View>
                                        {activeVideo === index && (
                                            <Video
                                                source={{ uri }}
                                                rate={1.0}
                                                volume={1.0}
                                                isMuted={false}
                                                resizeMode="contain"
                                                useNativeControls
                                                style={styles.fullVideo}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Notes */}
                    {match.notes && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Post-Match Notes</Text>
                            <View style={[styles.notesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Text style={[styles.notesText, { color: colors.text }]}>{match.notes}</Text>
                            </View>
                        </>
                    )}

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.primary }]} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={20} color={colors.primary} />
                            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Share</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.actionBtn, { borderColor: colors.danger }]} 
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            <Text style={[styles.actionBtnText, { color: colors.danger }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.editBtn, { backgroundColor: colors.secondary }]} 
                        onPress={() => navigation.navigate('AddMatch', { match })}
                    >
                        <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                        <Text style={styles.editBtnText}>Edit Match History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 30, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    teamContainer: { alignItems: 'center', flex: 1 },
    teamBadge: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#fff' },
    badgePlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    badgeLetter: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    teamName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
    scoreContainer: { alignItems: 'center', flex: 1 },
    scoreText: { color: '#fff', fontSize: 36, fontWeight: '950' },
    resultBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
    resultText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    headerFooter: { alignItems: 'center', marginTop: 20 },
    matchMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    infoCard: { width: '48%', padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
    infoValue: { fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
    infoLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    gallery: { flexDirection: 'row', marginBottom: 10 },
    galleryImage: { width: 140, height: 140, borderRadius: 12, marginRight: 12 },
    videoList: { gap: 10 },
    videoCard: { padding: 12, borderRadius: 12 },
    videoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    videoTitle: { fontSize: 14, fontWeight: 'bold' },
    fullVideo: { width: '100%', height: 200, marginTop: 10, borderRadius: 8 },
    notesCard: { padding: 15, borderRadius: 12, borderWidth: 1 },
    notesText: { fontSize: 14, lineHeight: 20 },
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
    actionBtnText: { fontWeight: 'bold', fontSize: 14 },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 12, gap: 8 },
    editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default MatchDetailsScreen;
