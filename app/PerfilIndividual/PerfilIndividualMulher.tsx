import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';

export default function PerfilIndividualMulher() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    });

    const fillAnim1 = useRef(new Animated.Value(0)).current;
    const fillAnim2 = useRef(new Animated.Value(0)).current;
    const fillAnim3 = useRef(new Animated.Value(0)).current;
    const fillAnim4 = useRef(new Animated.Value(0)).current;

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

    const backgroundColorInterpolation1 = fillAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3949AB', '#ff5721'],
    });

    const backgroundColorInterpolation2 = fillAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3949AB', '#ff5721'],
    });

    const backgroundColorInterpolation3 = fillAnim3.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3949AB', '#ff5721'],
    });

    const backgroundColorInterpolation4 = fillAnim4.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3949AB', '#ff5721'],
    });

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/PerfilIndividual/PerfilIndividual')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>MULHER</Text>
            <Text style={styles.subtitulo}>Escolha uma neoplasia</Text>

            <View style={styles.grid}>
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation1 }]}>
                    <TouchableOpacity
                        onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colo de Útero')}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="venus" size={30} color="white" />
                        <Text style={styles.buttonText}>Colo de Útero</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation2 }]}>
                    <TouchableOpacity
                        onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Mama')}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="ribbon" size={30} color="white" />
                        <Text style={styles.buttonText}>Mama</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation3 }]}>
                    <TouchableOpacity
                        onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colorretal')}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="stethoscope" size={30} color="white" />
                        <Text style={styles.buttonText}>Colorretal</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation4 }]}>
                    <TouchableOpacity
                        onPress={() => router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Pulmão')}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="lungs" size={30} color="white" />
                        <Text style={styles.buttonText}>Pulmão</Text>
                    </TouchableOpacity>
                </Animated.View>
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
    },
    changeButton: {
        position: 'absolute',
        flexDirection: 'row',
        top: 20,
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
        fontFamily: 'Quicksand-Bold',
        marginBottom: 20,
    },
    subtitulo: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Bold',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginBottom: 160,
        zIndex: 1,
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
        borderWidth: 3,
        borderColor: '#ff5721',
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
        position: 'absolute',
        bottom: 0,
        width: 900,
        height: 276,
        marginBottom: -20,
        left: -255,
        zIndex: 0,
    },
    backButtonTop: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#ff5721',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
});
