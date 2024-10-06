import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native'; // Importando o componente LottieView
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lottieRef = useRef<LottieView>(null); // Definir o tipo de ref para LottieView
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    const backAction = () => {
      router.replace('/paginaInicial');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const tipoUsuario = userData.tipoUsuario;

        if (tipoUsuario === 'populacao') {
          router.push('/Home/TelaDeHomeUsuario');
        } else if (tipoUsuario === 'saude') {
          router.push('/Home/TelaDeHomeProfissional');
        } else {
          Alert.alert('Erro', 'Tipo de usuário desconhecido.');
        }
      } else {
        Alert.alert('Erro', 'Documento do usuário não encontrado.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Animação Lottie no topo da página */}
      <View style={styles.lottieContainer}>
        <LottieView
          ref={lottieRef}
          source={require('../../assets/lottie/LOGIN.json')} // Importando o arquivo JSON da animação
          autoPlay
          loop={false} // Não repetir a animação
          speed={0.5} // Controlando a velocidade, 0.5 para metade da velocidade normal
          onAnimationFinish={() => {
            if (lottieRef.current) {
              lottieRef.current.pause();
            }
          }}
          style={styles.lottie}
        />

      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#AAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#AAA"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#ff5721" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Alterado para começar do topo
    alignItems: 'center',
    backgroundColor: '#232d97',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'Quicksand-Bold',
  },
  input: {
    width: 200,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 30,
    fontSize: 18,
    marginVertical: 10,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff5721',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 30,
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
  subcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3949AB',
    borderRadius: 15,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  titleAcima: {
    fontSize: 30,
    color: '#232d97',
    fontFamily: 'Quicksand-Bold',
    paddingHorizontal: 25,
    paddingVertical: 10,
    textAlign: 'center',
    marginBottom: 40,
  },
  lottieContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 5,
  },
  lottie: {
    width: Dimensions.get('window').width, // Largura total da tela
    height: 200, // Altura da animação, ajuste conforme necessário
  },
});
