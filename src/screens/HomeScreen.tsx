import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

// Importando os tipos para a navegação
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App'; // Ajuste o caminho se necessário

// Definindo o tipo das props para esta tela
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => { // Recebendo a prop 'navigation'
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')} // Navega para a tela 'Login'
      />
    </View>
  );
};

export default HomeScreen;

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