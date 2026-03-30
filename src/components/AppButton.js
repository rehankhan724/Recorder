import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AppButton = ({ title, onPress, loading = false, style, textStyle, variant = 'primary' }) => {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';
    
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { 
                  backgroundColor: isPrimary ? colors.primary : colors.card,
                  borderColor: isPrimary ? colors.primary : colors.border,
                  borderWidth: isPrimary ? 0 : 1,
                  shadowColor: isPrimary ? colors.primary : "#000",
                },
                style,
                loading && styles.disabled
            ]}
            onPress={loading ? null : onPress}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
            ) : (
                <Text style={[styles.text, { color: isPrimary ? colors.white : colors.primary }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    disabled: {
        opacity: 0.7,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default AppButton;
