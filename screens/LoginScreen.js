import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import ButtonGradient from '../components/ButtonGradient.js';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from '../database/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [contraseña, setPassword] = useState('');

    const handleLogin = async () => {
      if (!email || !contraseña) {
          alert('Por favor, completa todos los campos.');
          return;
      }
  
      const auth = getAuth();
      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, contraseña);
          const user = userCredential.user;
  
          // Verificar si el usuario existe en Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          await user.reload();
  
          if (userDoc.exists()) {
            if (user.emailVerified) {
                navigation.navigate('Menu'); // Navegar al menú si Firestore tiene el documento y el correo está verificado
            } else {
                alert('Por favor, verifica tu correo electrónico antes de continuar.');
                await signOut(auth); // Cerrar sesión automáticamente si no está verificado
            }
        } else {
            await signOut(auth);
            alert('Tu cuenta ha sido eliminada. Debes registrarte nuevamente.');
        }
      } catch (error) {
          switch (error.code) {
              case 'auth/invalid-email':
                  alert('Correo electrónico inválido.');
                  break;
              case 'auth/user-not-found':
                  alert('Usuario no encontrado.');
                  break;
              case 'auth/wrong-password':
                  alert('Contraseña incorrecta.');
                  break;
              default:
                  alert('Correo electrónico o contraseña son incorrectos.');
          }
          console.error('Error de inicio de sesión:', error.message);
      }
  };
  const reenviarCorreo = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
        if (user && !user.emailVerified) {
            await sendEmailVerification(user);
            alert('Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.');
        } else {
            alert('El correo ya está verificado o no hay usuario activo.');
        }
    } catch (error) {
        console.error('Error al reenviar correo de verificación:', error.message);
        alert('No se pudo enviar el correo de verificación.');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Smartcell</Text>
      <Text style={styles.subTitulo}>Iniciar Sesion</Text>
      <TextInput
        placeholder="example@hotmail.com"
        style={styles.TextInput}
        onChangeText={setEmail} 

      />
      <TextInput
        placeholder="constraseña"
        style={styles.TextInput}
        secureTextEntry={true}
        onChangeText={setPassword} 

      />
      <Text style={styles.forgotPassword} onPress={()=>navigation.navigate("Restablecer")} title={"Contraseña"} >¿Olvidaste tu contraseña?</Text>

      <View style={styles.buttonContainer}>
      <ButtonGradient onPress={handleLogin} title={"Ingresar"} />
      <ButtonGradient onPress={() => navigation.navigate('Registro')} title={"Registrarse"} />
      </View>
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    width: "60%", // Ancho más amplio y adaptable para pantallas
    justifyContent: "space-evenly", // Espacio uniforme entre botones
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 45, // Tamaño dinámico
    color: "#344340",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitulo: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
    textAlign: 'center',
  },
  TextInput: {
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    width: "80%", // Ancho adaptable
    height: 45,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: 14,
    color: '#3b5998',
    textAlign: 'center',
  },
  button: {
    flex: 1, // Botones ocupan el mismo espacio disponible
    marginHorizontal: 10, // Espacio entre botones
    backgroundColor: '#4c669f',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
