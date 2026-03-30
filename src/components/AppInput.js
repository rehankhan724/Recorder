import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AppInput = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, multiline, numberOfLines }) => {
    const { colors, theme } = useTheme();

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                    style={[styles.input, { color: colors.text, height: multiline ? (numberOfLines || 3) * 20 + 20 : 50 }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondary}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    input: {
        paddingHorizontal: 15,
        fontSize: 16,
    },
});

export default AppInput;
