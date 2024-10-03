import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import LottieView from 'lottie-react-native';
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
                router.replace('/Login/TelaLogin');
            }
        });

        const backAction = () => {
            router.replace('/Home/TelaDeHomeUsuario');
            return true;
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

            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/PerfilIndividual/PerfilIndividual')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mulher</Text>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.squareButton} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colo de Útero')}>
                    <FontAwesome5 name="venus" size={30} color="white" />
                    <Text style={styles.buttonText}>Colo de Útero</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.squareButton} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Mama')}>
                    <FontAwesome5 name="ribbon" size={30} color="white" />
                    <Text style={styles.buttonText}>Mama</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.squareButton} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colorretal')}>
                    <FontAwesome5 name="stethoscope" size={30} color="white" />
                    <Text style={styles.buttonText}>Colorretal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.squareButton} onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Pulmão')}>
                    <FontAwesome5 name="lungs" size={30} color="white" />
                    <Text style={styles.buttonText}>Pulmão</Text>
                </TouchableOpacity>
            </View>

            <LottieView
                source={require('../../assets/lottie/mulher2.json')}
                autoPlay
                loop={true}
                style={styles.lottie}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232d97',
        paddingHorizontal: 30,
        padding: 30,
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
        marginTop: 130,
        marginBottom: -100,
        fontFamily: 'Quicksand-Bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 130,
        marginBottom: -120,


    },
    squareButton: {
        width: '45%',
        aspectRatio: 1,
        backgroundColor: '#3949AB',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        fontFamily: 'Quicksand-Bold',
        padding: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Quicksand-Bold',
        textAlign: 'center',
    },
    iconMudar: {
        marginRight: 8,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 485,
        height: 300,
        marginTop: 75,
        marginLeft: 30,
    },
});