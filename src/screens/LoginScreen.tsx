import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

// Importando os tipos para a navegação
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App'; // Ajuste o caminho se necessário

// Definindo o tipo das props para esta tela
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => { // Recebendo a prop 'navigation'
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Button
        title="Ir para Home"
        onPress={() => navigation.navigate('Home')} // Navega para a tela 'Home'
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  }
});