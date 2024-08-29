import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function SplashScreenApp() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push({ pathname: '/paginaInicial' });
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/RASTREANDO.png')} style={styles.image} />
      <ActivityIndicator size="large" color="#3B29A6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 230,
    height: 230,
    marginBottom: 20,
  },
});
