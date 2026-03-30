import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';

const ScreenWrapper = ({ children, style, edges }) => {
    return (
        <SafeAreaView style={[styles.container, style]} edges={edges}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    }
});

export default ScreenWrapper;
