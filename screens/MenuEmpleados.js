import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../database/firebase';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, deleteUser } from 'firebase/auth'; // Importación adicional

export default function Menu() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <FontAwesome name="power-off" size={24} color="red" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const employeeList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setEmployees(employeeList);
    });

    return () => unsubscribe(); 
  }, []);

  const handleDelete = async (id) => {
    const auth = getAuth();
    const user = auth.currentUser; // Usuario autenticado actualmente

    try {
        await user.reload();
        
        if (user && user.uid === id) {
            // Eliminar la cuenta autenticada y cerrar sesión
            if (!user.emailVerified) {
                alert('No puedes eliminar tu cuenta sin verificar tu correo electrónico.');
                return;
            }

            await deleteDoc(doc(db, 'users', id)); // Eliminar de Firestore
            await deleteUser(user); // Eliminar de Authentication
            alert('Tu cuenta ha sido eliminada.');
            navigation.navigate('Ingresar');
        } else {
            // Intento de eliminar otro empleado
            await deleteDoc(doc(db, 'users', id)); // Eliminar de Firestore únicamente
            alert('Empleado eliminado correctamente.');
        }
    } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
            alert('Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta.');
            await signOut(auth);
            navigation.navigate('Ingresar'); // Redirigir para reautenticación
        } else {
            console.error('Error al borrar empleado:', error.message);
            alert('Error al eliminar empleado.');
        }
    }
};




  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Ingresar');
    } catch (error) {
      alert('Hubo un problema al cerrar sesión');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.nombre && employee.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient colors={['#DDE4F0', '#CFD8DC']} style={styles.container}>
      <View style={styles.headerContainer}></View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar empleado..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Agregar')}
      >
        <LinearGradient colors={['#388e3c', '#2e7d32']} style={styles.createButton}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.createButtonText}>Crear Empleado</Text>
        </LinearGradient>
      </TouchableOpacity>

      {filteredEmployees.length === 0 ? (
        <Text>No hay empleados disponibles</Text>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.employeeContainer}>
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeText}>Nombre: {item.nombre}</Text>
                <Text style={styles.employeeText}>Email: {item.email}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('Mostrar', { employee: item })}
                >
                  <LinearGradient colors={['#FFA000', '#FF6F00']} style={styles.viewButton}>
                    <FontAwesome name="eye" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('Editar', { employeeId: item.id })}
                >
                  <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.editButton}>
                    <MaterialIcons name="edit" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <LinearGradient colors={['#b71c1c', '#d32f2f']} style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  employeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  viewButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
  },
  createButton: {
    alignSelf: 'center',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});
