import { FontAwesome5 } from '@expo/vector-icons'; // Importando ícone de laço
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaginaInicial() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleRastreando}>RASTREANDO</Text>
      </View>
      <FontAwesome5 name="ribbon" size={40} color="#FFFFFF"/>
      <Text style={styles.subtitle}>APP</Text>
      <View style={styles.subcontainer}>
        <LottieView
          source={require('../assets/lottie/logo.json')}
          autoPlay
          loop={true}
          speed={0.6}
          style={styles.lottie}
        />
        <Text style={styles.title}>Bem-vindo(a)!</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/Login/TelaLogin')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/Cadastro/TelaCadastro')}>
            <Text style={styles.buttonText}>Cadastre-se</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232d97',
  },
  titleContainer: {
    flexDirection: 'row', // Alinha o texto e o ícone em uma linha
    alignItems: 'center', // Centraliza verticalmente o conteúdo
    marginBottom: 10, // Adiciona um espaço abaixo
  },
  subcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3949AB',
    borderRadius: 15,
    padding: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'Quicksand-Bold',
  },
  button: {
    backgroundColor: '#ff5721',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  lottie: {
    width: 300,
    height: 300,
    marginBottom: -60,
    marginTop: -60,
  },
  titleRastreando: {
    fontSize: 35,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    backgroundColor: '#ff5721',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 10,
    textAlign: 'center',
    lineHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 25,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 10,
    marginTop: 10,
  },
});
