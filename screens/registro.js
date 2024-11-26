import React, { useState, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { db } from '../database/firebase';
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import ButtonGradient from '../components/ButtonGradient.js';

const Registro = ({ navigation }) => {
    const [state, setState] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        celular: "",
        direccion: "",
        contraseña: "",
        repetirContraseña: "",
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
        });
    }, [navigation]);

    const handleChangeText = (nombre, value) => {
        setState({ ...state, [nombre]: value });
    };

    const crearusuario = async () => {
        if (
            !state.nombre ||
            !state.apellido ||
            !state.dni ||
            !state.email ||
            !state.celular ||
            !state.direccion ||
            !state.contraseña ||
            !state.repetirContraseña
        ) {
            alert("Por favor, rellena todos los campos.");
            return;
        }
    
        if (state.contraseña !== state.repetirContraseña) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }
    
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, state.email, state.contraseña);
            const user = userCredential.user;
    
            await sendEmailVerification(user);
            alert('Registro exitoso. Por favor, verifica tu correo antes de iniciar sesión.');
    
            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                nombre: state.nombre,
                apellido: state.apellido,
                email: state.email,
                celular: state.celular,
                direccion: state.direccion,
                dni: state.dni,
                contraseña: state.contraseña,
            });
    
            navigation.navigate('Ingresar');
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("El correo ya está registrado.");
            } else {
                alert('Hubo un problema al crear el usuario: ' + error.message);
                console.error(error);
            }
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Crear cuenta</Text>
            <TextInput
                placeholder="Nombre"
                style={styles.TextInput}
                value={state.nombre}
                onChangeText={(value) => handleChangeText("nombre", value)}
            />
            <TextInput
                placeholder="Apellido"
                style={styles.TextInput}
                value={state.apellido}
                onChangeText={(value) => handleChangeText("apellido", value)}
            />
            <TextInput
                placeholder="Email"
                style={styles.TextInput}
                value={state.email}
                onChangeText={(value) => handleChangeText("email", value)}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Teléfono"
                style={styles.TextInput}
                value={state.celular}
                onChangeText={(value) => handleChangeText("celular", value)}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Dirección"
                style={styles.TextInput}
                value={state.direccion}
                onChangeText={(value) => handleChangeText("direccion", value)}
            />
            <TextInput
                placeholder="DNI"
                style={styles.TextInput}
                value={state.dni}
                onChangeText={(value) => handleChangeText("dni", value)}
            />
            <TextInput
                placeholder="Contraseña"
                style={styles.TextInput}
                value={state.contraseña}
                onChangeText={(value) => handleChangeText("contraseña", value)}
                secureTextEntry={true}
            />
            <TextInput
                placeholder="Repetir Contraseña"
                style={styles.TextInput}
                value={state.repetirContraseña}
                onChangeText={(value) => handleChangeText("repetirContraseña", value)}
                secureTextEntry={true} // Oculta el texto mientras se escribe
            />
            <TouchableOpacity style={styles.menuButton}>
                <ButtonGradient onPress={crearusuario} title={"Registrar"} />
                <ButtonGradient onPress={() => navigation.navigate('Ingresar')} title={"Cancelar"} />
            </TouchableOpacity>

            <StatusBar style="auto" />
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
    menuButton: {
        flexDirection: "row",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: "100%",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default Registro;
