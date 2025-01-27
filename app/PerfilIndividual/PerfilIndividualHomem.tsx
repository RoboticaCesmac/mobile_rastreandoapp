import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';

export default function PerfilIndividualHomem() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    });

    const fillAnim1 = useRef(new Animated.Value(0)).current;
    const fillAnim2 = useRef(new Animated.Value(0)).current;
    const fillAnim3 = useRef(new Animated.Value(0)).current;

    const [actionCompleted1, setActionCompleted1] = useState(false);
    const [actionCompleted2, setActionCompleted2] = useState(false);
    const [actionCompleted3, setActionCompleted3] = useState(false);

    const handlePressIn1 = () => {
        Animated.timing(fillAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setActionCompleted1(true);
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Próstata');
            }
        });
    };

    const handlePressOut1 = () => {
        if (!actionCompleted1) {
            Animated.timing(fillAnim1, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handlePressIn2 = () => {
        Animated.timing(fillAnim2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setActionCompleted2(true);
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colorretal');
            }
        });
    };

    const handlePressOut2 = () => {
        if (!actionCompleted2) {
            Animated.timing(fillAnim2, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handlePressIn3 = () => {
        Animated.timing(fillAnim3, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setActionCompleted3(true);
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Pulmão');
            }
        });
    };

    const handlePressOut3 = () => {
        if (!actionCompleted3) {
            Animated.timing(fillAnim3, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

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

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/PerfilIndividual/PerfilIndividual')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>HOMEM</Text>
            <Text style={styles.subtitulo}>Segure para escolher</Text>

            <View style={styles.grid}>
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation1 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn1}
                        onPressOut={handlePressOut1}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="mars" size={30} color="white" />
                        <Text style={styles.buttonText}>Próstata</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation2 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn2}
                        onPressOut={handlePressOut2}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="stethoscope" size={30} color="white" />
                        <Text style={styles.buttonText}>Colorretal</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <View style={styles.grid2}>
                <Animated.View style={[styles.squareButton2, { backgroundColor: backgroundColorInterpolation3 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn3}
                        onPressOut={handlePressOut3}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="lungs" size={30} color="white" />
                        <Text style={styles.buttonText}>Pulmão</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <LottieView
                source={require('../../assets/lottie/homem2.json')}
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
        marginBottom: 20,
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
    grid2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 160,
        zIndex: 1,
    },
    squareButton2: {
        width: '40%',
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
        height: 290,
        marginBottom: -20,
        left: -270,
        zIndex: 0,
    },
});