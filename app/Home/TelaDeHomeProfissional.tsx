import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';


export default function TelaDeHomeProfissional() {
  const router = useRouter();
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

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {userName ? <Text style={styles.welcomeText}>Bem vindo(a), {userName}</Text> : null}
      <LottieView
        source={require('../../assets/lottie/laco.json')}
        autoPlay
        loop={false}
        speed={0.8}
        style={styles.lottie}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('/RastrearMeuPaciente/RastrearMeuPaciente')}>
        <Text style={styles.buttonText}>Rastrear Meu Paciente</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Home/TelaDeHomeProfissionalPessoal')}>
        <Text style={styles.buttonText}>Meu Perfil</Text>
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
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
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
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Quicksand-Bold',
  },
  lottie: {
    width: 400,
    height: 400,
    marginBottom: -80,
    marginTop: -100,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: 'Quicksand-Bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});
