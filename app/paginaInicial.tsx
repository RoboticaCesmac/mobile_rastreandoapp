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
      return true; // Bloqueia o botão "back"
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Limpar o listener ao desmontar o componente
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.titleRastreando}>RASTREANDO</Text>
      <Text style={styles.subtitle}>APP</Text>
      <LottieView
        source={require('../assets/lottie/logo.json')}
        autoPlay
        loop={true}
        speed={0.7} // Ajuste a velocidade conforme necessário
        style={styles.lottie}
      />
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Login/TelaLogin')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Cadastro/TelaCadastro')}>
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
    backgroundColor: '#232d97', // Azul escuro
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF', // Branco
    marginBottom: 30,
    fontFamily: 'Quicksand-Medium',
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
    fontFamily: 'Quicksand-Medium',
  },
  lottie: {
    width: 200, // Ajuste o tamanho conforme necessário
    height: 200, // Ajuste o tamanho conforme necessário
  },
  titleRastreando: {
    fontSize: 32,
    color: '#ff5721',
    fontFamily: 'Quicksand-Bold',
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Quicksand-Medium',
  },
});
