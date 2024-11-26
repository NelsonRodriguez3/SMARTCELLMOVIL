import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import ButtonGradient from '../components/ButtonGradient.js';

const Restablecer = ({ navigation }) => {
    const [email, setEmail] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
        });
    }, [navigation]);

    const restablecerContraseña = async () => {
        if (!email) {
            alert("Por favor ingresa tu correo electrónico.");
            return;
        }

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            alert('Se ha enviado un correo para restablecer la contraseña. Por favor, revisa tu bandeja de entrada o spam.');
            navigation.navigate('Ingresar'); 
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('El correo electrónico ingresado no es válido.');
                    break;
                case 'auth/user-not-found':
                    alert('No se encontró un usuario con ese correo.');
                    break;
                default:
                    console.error('Error al enviar el correo de restablecimiento:', error.message);
                    alert('Hubo un problema al intentar restablecer la contraseña.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Restablecer Contraseña</Text>
            <TextInput
                placeholder="Correo electrónico"
                style={styles.TextInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <View style={styles.buttonContainer}>
                <ButtonGradient onPress={restablecerContraseña} title={"Enviar correo"} />
                <ButtonGradient onPress={() => navigation.navigate('Ingresar')} title={"Cancelar"} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: '#f1f1f1',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "gray",
        marginBottom: 10,
    },
    TextInput: {
        borderWidth: 2,
        borderColor: "gray",
        padding: 10,
        width: "80%",
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        flexDirection: 'row', // Alineación horizontal
        marginTop: 30,
        justifyContent: 'space-evenly', // Mantener botones centrados
        alignItems: 'center',
        width: '90%', // Ancho más ajustado del contenedor
    },
    button: {
        backgroundColor: '#4c669f',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%', // Cada botón ocupa un 48% del contenedor
        marginHorizontal: 5, // Pequeño espacio entre botones
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Restablecer;

