import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUkNyyrb7s_7H1Cqalyaj9nDHpnzj0HAs",
  authDomain: "fir-atividade4.firebaseapp.com",
  projectId: "fir-atividade4",
  storageBucket: "fir-atividade4.firebasestorage.app",
  messagingSenderId: "376112453653",
  appId: "1:376112453653:web:4e006dc4c1adcbd1b9161c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

//Tela Inicial; Tela de Login; Primeira tela:
//NOTA1: Lembrar de botar a requisição de Login e Senha.

function LoginScreen({ navigation }){
  return(
    <SafeAreaView>
      <Text>Login</Text>
      <TextInput></TextInput>
      <Text>Senha</Text>
      <TextInput></TextInput>
      <TouchableOpacity onPress={() => navigation.navigate("Coin")}>
        <Text>Entrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

function CoinScreen({ navigation, route }){
  return(
    <SafeAreaView>
    </SafeAreaView>
  )
}
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login"
          component={LoginScreen}
          options={{headerTitleAlign: 'center'}}
        />
        <Stack.Screen
          name="Coin"
          component={CoinScreen}
          options={{headerTitleAlign: 'center'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
