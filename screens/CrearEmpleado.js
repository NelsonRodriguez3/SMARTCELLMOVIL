import React, { useState, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,} from "react-native";
import { db } from '../database/firebase';
import { doc, setDoc } from "firebase/firestore"; // Cambiado addDoc por setDoc
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Importación necesaria para Auth
import ButtonGradient from '../components/ButtonGradient.js';

const CrearEmpleado = ({ navigation }) => {
    const [state, setState] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        celular: "",
        direccion: "",
        contraseña: "",
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
            state.nombre === "" || 
            state.apellido === "" || 
            state.dni === "" ||
            state.email === "" || 
            state.celular === "" || 
            state.direccion === "" || 
            state.contraseña === ""
        ) {
            alert("Por favor, rellena todos los campos.");
        } else {
            try {
                const auth = getAuth();
    
                // Registrar usuario en Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, state.email, state.contraseña);
                const user = userCredential.user;
    
                // Enviar correo de verificación
                await sendEmailVerification(user);
                alert('Empleado creado con éxito. Por favor, verifica el correo antes de usar la cuenta.');

                await user.reload();
    
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
    
                navigation.navigate('Menu'); // Redirigir al menú
            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                    alert("El correo ya está registrado.");
                } else {
                    alert('Hubo un problema al crear el empleado.' + error.message);
                    console.error(error);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Agregar Empleado</Text>
            
            {/* Campos de entrada */}
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
            
            {/* Botones */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={crearusuario}>
                    <Text style={styles.buttonText}>Crear Empleado</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu')}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", // Centra el contenido verticalmente
        alignItems: "center", // Centra horizontalmente
        paddingHorizontal: 20,
        backgroundColor: '#f1f1f1',
    },
    text: {
        fontSize: 24, // Tamaño más moderado para el título
        fontWeight: 'bold',
        color: "gray",
        marginBottom: 20,
    },
    TextInput: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        width: "90%", // Mantener responsivo en diferentes tamaños de pantalla
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        flexDirection: 'row', // Alinea los botones horizontalmente
        justifyContent: 'space-between',
        width: "60%", // Ajusta el contenedor al ancho de la pantalla
        marginTop: 20,
    },
    menuButton: {
        padding: 15,
        borderRadius: 10,
        width: "40%", // Cada botón ocupa el 45% del ancho del contenedor
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#3b5998',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CrearEmpleado;
