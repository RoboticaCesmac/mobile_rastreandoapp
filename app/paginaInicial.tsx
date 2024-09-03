import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaginaInicial() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      return true; // Bloqueia o botão "back"
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Limpar o listener ao desmontar o componente
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/TelaLogin')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/TelaCadastro')}>
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A237E', // Azul escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Branco
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3949AB', // Tom de azul mais claro
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Branco
    fontSize: 18,
    fontWeight: 'bold',
  },
});
