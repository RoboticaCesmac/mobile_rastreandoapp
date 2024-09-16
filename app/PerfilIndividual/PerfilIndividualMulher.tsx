import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';

export default function PerfilIndividualMulher() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
      });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/Login/TelaLogin'); // Substitui para não voltar à TelaDeHomeUsuario
            }
        });

        const backAction = () => {
            router.replace('/Home/TelaDeHomeUsuario'); // Substitui a rota por TelaDeHomeUsuario
            return true; // Evita o comportamento padrão de "back"
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            {/* Botão Mudar */}
            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/PerfilIndividual/PerfilIndividual')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mulher</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colo de Útero')}>
                <Text style={styles.buttonText}>Colo de Útero</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Mama')}>
                <Text style={styles.buttonText}>Mama</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colorretal')}>
                <Text style={styles.buttonText}>Colorretal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Pulmão')}>
                <Text style={styles.buttonText}>Pulmão</Text>
            </TouchableOpacity>
        </View>
    );
}

// Estilos (permanece igual)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232d97',
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    changeButton: {
        position: 'absolute',
        flexDirection: 'row',
        top: 40,
        width: 90,
        right: 20,
        padding: 10,
        backgroundColor: '#3949AB',
        borderRadius: 20,
        fontFamily: 'Quicksand-Bold',
    },
    changeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: -2,
        fontFamily: 'Quicksand-Bold',
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: 'Quicksand-Bold',
    },
    button: {
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
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 10,
        fontFamily: 'Quicksand-Bold',
    },
    iconMudar: {
        marginRight: 8,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
});
