import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ButtonGradient({ onPress, title }) {
    return (
    <TouchableOpacity
        style={styles.container}
        onPress={onPress}
    >
        <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.button}
        >
        <Text style={styles.text}>{title}</Text>
    </LinearGradient>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
    width: 60,
    marginTop: 20,
    alignItems: "center",
    },
    button: {
    width: "150%",
    height: 50,
    borderRadius: 25,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    },
    text: {
    fontSize: 14,
    color: "white",
    },
});
