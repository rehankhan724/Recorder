import { db, auth, isConfigured } from './firebaseConfig';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    deleteDoc, 
    doc, 
    updateDoc, 
    serverTimestamp 
} from 'firebase/firestore';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATCHES_COLLECTION = 'matches';
const LOCAL_STORAGE_KEY = '@match_recorder_history';

// Helper to check if the device is online
export const checkOnlineStatus = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
};

// LOCAL FALLBACKS
const getLocalMatches = async () => {
    const json = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
};

const saveLocalMatch = async (data) => {
    const matches = await getLocalMatches();
    const newMatch = { id: Date.now().toString(), ...data, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newMatch, ...matches]));
    return newMatch;
};

export const saveMatch = async (matchData) => {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
        throw new Error('Internet connection required to record a new match. This ensures your data is safely backed up.');
    }

    if (!isConfigured) {
        return await saveLocalMatch(matchData);
    }

    const userId = auth?.currentUser?.uid;
    if (!userId) throw new Error('You must be logged in to save matches.');

    try {
        const docRef = await addDoc(collection(db, MATCHES_COLLECTION), {
            ...matchData,
            userId,
            createdAt: serverTimestamp(),
        });
        return { id: docRef.id, ...matchData };
    } catch (e) {
        console.error('Firestore Save Error:', e);
        throw e;
    }
};

export const getMatches = async () => {
    // Reading matches is always allowed offline from local cache or AsyncStorage
    if (!isConfigured) {
        return await getLocalMatches();
    }
    const userId = auth?.currentUser?.uid;
    if (!userId) return [];

    try {
        const q = query(
            collection(db, MATCHES_COLLECTION),
            where('userId', '==', userId),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const matches = [];
        querySnapshot.forEach((doc) => {
            matches.push({ id: doc.id, ...doc.data() });
        });
        return matches;
    } catch (e) {
        console.error('Firestore Get Error:', e);
        // Fallback to offline cache if network query fails
        return [];
    }
};

export const deleteMatch = async (id) => {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
        throw new Error('Internet connection required to delete matches.');
    }

    if (!isConfigured) {
        const matches = await getLocalMatches();
        const filtered = matches.filter(m => m.id !== id);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        return;
    }

    try {
        await deleteDoc(doc(db, MATCHES_COLLECTION, id));
    } catch (e) {
        console.error('Firestore Delete Error:', e);
        throw e;
    }
};

export const updateMatch = async (updatedMatch) => {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
        throw new Error('Internet connection required to edit matches.');
    }

    if (!isConfigured) {
        const matches = await getLocalMatches();
        const index = matches.findIndex(m => m.id === updatedMatch.id);
        if (index !== -1) {
            matches[index] = { ...matches[index], ...updatedMatch };
            await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matches));
            return matches[index];
        }
        return updatedMatch;
    }

    const { id, ...data } = updatedMatch;
    try {
        const docRef = doc(db, MATCHES_COLLECTION, id);
        await updateDoc(docRef, data);
        return updatedMatch;
    } catch (e) {
        console.error('Firestore Update Error:', e);
        throw e;
    }
};
