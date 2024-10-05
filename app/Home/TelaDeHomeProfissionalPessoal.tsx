import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';

export default function TelaDeHomeUsuario() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });
  const [userName, setUserName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.nome);
        }
      }
    };

    fetchUserName();
  }, []);

  const handlePerfilIndividualPress = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const genero = userData.genero;

        if (genero === 'mulher') {
          router.push('/PerfilIndividual/PerfilIndividualMulher');
        } else if (genero === 'homem') {
          router.push('/PerfilIndividual/PerfilIndividualHomem');
        } else {
          router.push('/PerfilIndividual/PerfilIndividual');
        }
      }
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace('/Login/TelaLogin');
      })
      .catch((error) => {
        console.error('Erro ao realizar logout:', error);
        Alert.alert('Erro', 'Não foi possível realizar o logout. Tente novamente.');
      });
  };
  
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LottieView
        source={require('../../assets/lottie/logo.json')}
        autoPlay
        loop={true}
        speed={0.7}
        style={styles.lottie}
      />
      {userName ? <Text style={styles.welcomeText}>Bem vindo(a), {userName}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handlePerfilIndividualPress}>
        <Text style={styles.buttonText}>Perfil Individual</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/ProximosExames/ProximosExames')}>
        <Text style={styles.buttonText}>Seus próximos exames</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/MarcarConsulta/MarcarConsulta')}>
        <Text style={styles.buttonText}>Marque uma consulta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#3949AB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});