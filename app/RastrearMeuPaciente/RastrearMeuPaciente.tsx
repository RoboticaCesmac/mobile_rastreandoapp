import { FontAwesome5 } from '@expo/vector-icons'; // Pacote de ícones
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';

export default function RastrearMeuPaciente() {
  const [escolha, setEscolha] = useState<string | null>(null);
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
      });

    const confirmarEscolha = async () => {
        if (escolha) {
            Alert.alert(
                'Confirmação',
                `Você confirma sua escolha?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        onPress: async () => {
                            const user = auth.currentUser;
                            if (user) {
                                const userRef = doc(db, "usuarios", user.uid);
                                await updateDoc(userRef, {
                                    genero: escolha,
                                });

                                if (escolha === 'mulher') {
                                    router.push('/RastrearMeuPaciente/RastrearMulher');
                                } else {
                                  router.push('/RastrearMeuPaciente/RastrearHomem');
                                }
                            }
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Erro', 'Por favor, escolha uma opção antes de confirmar.');
        }
    };

  return (
    <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.title}>Quem você quer rastrear?</Text>
        <TouchableOpacity
            style={[styles.optionButton, escolha === 'mulher' && styles.optionButtonSelected]}
            onPress={() => setEscolha('mulher')}>
            <FontAwesome5 name="female" size={24} color="white" />
            <Text style={styles.optionText}>MULHER</Text>
        </TouchableOpacity>
        
            <LottieView
                source={require('../../assets/lottie/escolha3.json')}
                autoPlay
                loop={true}
                speed={1.2}
                style={styles.lottie}
            />
        
        <TouchableOpacity
            style={[styles.optionButton, escolha === 'homem' && styles.optionButtonSelected]}
            onPress={() => setEscolha('homem')}>
            <FontAwesome5 name="male" size={24} color="white" />
            <Text style={styles.optionText}>HOMEM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmarEscolha}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    paddingHorizontal: 20,
},
title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
},
optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
    fontFamily: 'Quicksand-Bold',
},
optionButtonSelected: {
    backgroundColor: '#ff5721',
},
optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Quicksand-Bold',
},
confirmButton: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
},
confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
},
lottie: {
    width: 300,
    height: 300,
    marginBottom:-30,
    marginTop:-30,
  },
});
