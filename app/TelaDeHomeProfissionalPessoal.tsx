import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useFocusEffect, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback } from 'react';
import { Alert, BackHandler, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../config/firebase-config';

export default function TelaDeHomeProfissionalPessoal() {
  const router = useRouter();

  // Bloqueando o botão "back" do dispositivo
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // Impede o comportamento padrão do botão "back"
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handlePerfilIndividualPress = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const genero = userData.genero;

        if (genero === 'mulher') {
          router.push('/PerfilIndividualMulher');
        } else if (genero === 'homem') {
          router.push('/PerfilIndividualHomem');
        } else {
          router.push('/PerfilIndividual');
        }
      }
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  };

  const handleBack = () => {
    router.push('/TelaDeHomeProfissional');

  };
  
  

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={require('../assets/images/RASTREANDO.png')} style={styles.logo} />
      <TouchableOpacity style={styles.button} onPress={handlePerfilIndividualPress}>
        <Text style={styles.buttonText}>Perfil Individual</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/ProximosExames')}>
        <Text style={styles.buttonText}>Seus próximos exames</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/MarcarConsulta')}>
        <Text style={styles.buttonText}>Marque uma consulta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A237E',
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
