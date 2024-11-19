import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CrearEmpleado from './screens/CrearEmpleado'; // Pantalla de registro de empleados
import MenuEmpleados from './screens/MenuEmpleados';
import VerEmpleados from './screens/VerEmpleados';
import EditarEmpleado from './screens/EditarEmpleado';
import registro from './screens/registro';
import contraseña from './screens/contraseña';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Ingresar">
        <Stack.Screen name="Ingresar" component={LoginScreen} />
        <Stack.Screen name="Restablecer" component={contraseña} />
        <Stack.Screen name="Registro" component={registro} />
        <Stack.Screen name="Menu" component={MenuEmpleados} />
        <Stack.Screen name="Agregar" component={CrearEmpleado} />
        <Stack.Screen name="Mostrar" component={VerEmpleados} />
        <Stack.Screen name="Editar" component={EditarEmpleado} />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}