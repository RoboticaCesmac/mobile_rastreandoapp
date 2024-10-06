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

    // Animações de preenchimento para cada botão
    const fillAnim1 = useRef(new Animated.Value(0)).current;
    const fillAnim2 = useRef(new Animated.Value(0)).current;
    const fillAnim3 = useRef(new Animated.Value(0)).current;
    const fillAnim4 = useRef(new Animated.Value(0)).current;

    const [actionCompleted1, setActionCompleted1] = useState(false);
    const [actionCompleted2, setActionCompleted2] = useState(false);
    const [actionCompleted3, setActionCompleted3] = useState(false);
    const [actionCompleted4, setActionCompleted4] = useState(false);

    // Funções de preenchimento para cada botão
    const handlePressIn1 = () => {
        Animated.timing(fillAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setActionCompleted1(true);
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colo de Útero');
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
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Mama');
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
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Colorretal');
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

    const handlePressIn4 = () => {
        Animated.timing(fillAnim4, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setActionCompleted4(true);
                router.push('/PerfilIndividual/PerfilInformacoesNeoplasia?neoplasia=Pulmão');
            }
        });
    };

    const handlePressOut4 = () => {
        if (!actionCompleted4) {
            Animated.timing(fillAnim4, {
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

    // Interpolação de cores para cada botão
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

            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/PerfilIndividual/PerfilIndividual')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>MULHER</Text>
            <Text style={styles.subtitulo}>Segure para escolher</Text>

            <View style={styles.grid}>
                {/* Botão 1 */}
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation1 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn1}
                        onPressOut={handlePressOut1}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="venus" size={30} color="white" />
                        <Text style={styles.buttonText}>Colo de Útero</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Botão 2 */}
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation2 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn2}
                        onPressOut={handlePressOut2}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="ribbon" size={30} color="white" />
                        <Text style={styles.buttonText}>Mama</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Botão 3 */}
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation3 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn3}
                        onPressOut={handlePressOut3}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FontAwesome5 name="stethoscope" size={30} color="white" />
                        <Text style={styles.buttonText}>Colorretal</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Botão 4 */}
                <Animated.View style={[styles.squareButton, { backgroundColor: backgroundColorInterpolation4 }]}>
                    <TouchableOpacity
                        onPressIn={handlePressIn4}
                        onPressOut={handlePressOut4}
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
        justifyContent: 'center', // Centraliza o grid verticalmente
        alignItems: 'center', // Centraliza o grid horizontalmente
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
        marginBottom: 20, // Espaçamento abaixo do título
    },
    subtitulo: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Bold',
        marginBottom: 20, // Espaçamento abaixo do título
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Garante a distribuição uniforme dos botões
        alignItems: 'center', // Centraliza verticalmente dentro do container
        width: '80%', // Ajusta a largura do grid para centralização
        marginBottom: 160,
        zIndex: 1, // Garante que o grid esteja à frente do Lottie
    },
    squareButton: {
        width: '45%', // 2 botões por linha
        aspectRatio: 1, // Mantém o formato quadrado
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
        bottom: 0, // Fixar na base
        width: 900, // Ocupa 100% da largura
        height: 276, // Altura da animação, ajustável conforme necessário
        marginBottom: -20,
        left: -255,
        zIndex: 0, // Garante que o grid esteja à frente do Lottie
    },
});
