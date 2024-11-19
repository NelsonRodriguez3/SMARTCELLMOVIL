import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VerEmpleados = ({ route }) => {
  const { employee } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalles del Empleado</Text>
      <View style={styles.employeeContainer}>
        <Text style={styles.text}>Nombre: {employee.nombre}</Text>
        <Text style={styles.text}>Apellido: {employee.apellido}</Text>
        <Text style={styles.text}>DNI: {employee.dni}</Text>
        <Text style={styles.text}>Email: {employee.email}</Text>
        <Text style={styles.text}>Celular: {employee.celular}</Text>
        <Text style={styles.text}>Dirección: {employee.direccion}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  employeeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 30,
    color: "#344340",
    fontWeight: "bold",
    marginBottom: 30,
  },
});

export default VerEmpleados;
