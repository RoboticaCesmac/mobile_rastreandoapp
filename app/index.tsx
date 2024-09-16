import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenApp() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push({ pathname: '/paginaInicial' });
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  if (!fontsLoaded) {
    return null; // Retorna null até que as fontes sejam carregadas
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LottieView
        source={require('../assets/lottie/lupa.json')}
        autoPlay
        loop={true}
        speed={0.5} // Ajuste a velocidade conforme necessário
        style={styles.lottie}
      />
      <Text style={styles.title}>RASTREANDO</Text>
      <Text style={styles.subtitle}>APP</Text>
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
  lottie: {
    width: 120, // Ajuste o tamanho conforme necessário
    height: 120, // Ajuste o tamanho conforme necessário
    marginBottom: 20,
  },
  title: {
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