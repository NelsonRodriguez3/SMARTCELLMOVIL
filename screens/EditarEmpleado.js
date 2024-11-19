import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../database/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import GradientButton from '../components/ButtonGradient.js';

const EditarEmpleado = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [state, setState] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    celular: "",
    direccion: "",
  });


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  
  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, 'users', employeeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setState(docSnap.data());
      } else {
        Alert.alert("Error", "Empleado no encontrado");
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleChangeText = (nombre, value) => {
    setState({ ...state, [nombre]: value });
  };

  const actualizarEmpleado = async () => {
    try {
      const docRef = doc(db, 'users', employeeId);
      await updateDoc(docRef, {
        nombre: state.nombre,
        apellido: state.apellido,
        email: state.email,
        celular: state.celular,
        direccion: state.direccion,
        dni: state.dni,
      });
      let Guardar = confirm("¿Estas Seguro que quiere modificar los datos del empleado ?")
        if (Guardar == true) {
          alert('El usuario a sido modificado correctamente.');
          navigation.navigate('Menu');
        } else{
          alert('Los datos a actualizar a sido cancelado.');
        }
      } catch (error) {
          Alert.alert("Error", "Hubo un problema al actualizar el empleado.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Empleado</Text>
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
        placeholder="Direccion"
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
      <View style={styles.buttonContainer}>
      <GradientButton title="Guardar" onPress={actualizarEmpleado}/>
      <GradientButton title="Cancelar" onPress={() => navigation.navigate('Menu')} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
      flexDirection: 'row',
      marginTop: 40,
      width: "50%", // Ajuste dinámico del contenedor de botones
      justifyContent: "space-between", // Espacio uniforme entre botones
      alignItems: 'center', // Asegura que estén alineados
  },
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
      width: "80%", // Ancho dinámico para diferentes pantallas
      marginTop: 10,
      borderRadius: 10,
      backgroundColor: "#fff",
  },
  menuButton: {
      backgroundColor: '#4c669f',
      borderRadius: 20,
      paddingVertical: 10, // Altura reducida para mejor ajuste
      paddingHorizontal: 25, // Espaciado horizontal
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center', // Centra el texto en los botones
  },
  label: {
      fontSize: 16,
      color: "gray",
      width: "10%", 
      textAlign: 'left', 
  },
  volverButton: {
      backgroundColor: '#4c669f',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 25,
  },
  titulo: {
      fontSize: 30,
      color: "#344340",
      fontWeight: "bold",
      marginBottom: 30,
  },
});


export default EditarEmpleado;
