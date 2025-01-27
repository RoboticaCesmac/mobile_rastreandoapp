import { useFonts } from 'expo-font';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';


const firestore = getFirestore();
const authInstance = getAuth();

export default function PerfilInformacoesNeoplasia() {
    const router = useRouter();
    const { neoplasia } = useLocalSearchParams();
    const [title, setTitle] = useState<string>('');
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/Login/TelaLogin');
            }
        });

        if (neoplasia) {
            console.log("Neoplasia capturada da URL:", neoplasia);
            setTitle(neoplasia as string);
        }

        return () => unsubscribe();
    }, [neoplasia]);

    const redirecionarParaCalculoDeRisco = async () => {
        const user = authInstance.currentUser;

        if (user) {
            const userDocRef = doc(firestore, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const genero = userData.genero;

                let caminho = '';

                if (genero === 'homem') {
                    switch (neoplasia) {
                        case 'Próstata':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRHomem/CalculeSeuRiscoProstata';
                            break;
                        case 'Colorretal':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRHomem/CalculeSeuRiscoColorretal';
                            break;
                        case 'Pulmão':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRHomem/CalculeSeuRiscoPulmao';
                            break;
                        default:
                            console.error('Neoplasia desconhecida para homens');
                    }
                } else if (genero === 'mulher') {
                    switch (neoplasia) {
                        case 'Colo de Útero':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRMulher/CalculeSeuRiscoColoDeUtero';
                            break;
                        case 'Mama':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRMulher/CalculeSeuRiscoMama';
                            break;
                        case 'Colorretal':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRMulher/CalculeSeuRiscoColorretal';
                            break;
                        case 'Pulmão':
                            caminho = '/PerfilIndividual/CalculeSeuRisco/CSRMulher/CalculeSeuRiscoPulmao';
                            break;
                        default:
                            console.error('Neoplasia desconhecida para mulheres');
                    }
                } else {
                    console.error('Gênero desconhecido');
                }

                if (caminho) {
                    router.push(caminho as Href<string>);
                }
            } else {
                console.error('Documento do usuário não encontrado');
            }
        } else {
            console.error('Usuário não está logado');
        }
    };

    const redirecionarParaExamesDeRastreio = async () => {
        const user = authInstance.currentUser;

        if (user) {
            const userDocRef = doc(firestore, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const genero = userData.genero;

                let caminho = '';

                if (genero === 'homem') {
                    switch (neoplasia) {
                        case 'Próstata':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRHomem/SeusExamesDeRastreioProstataMasculino';
                            break;
                        case 'Colorretal':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRHomem/SeusExamesDeRastreioColorretalMasculino';
                            break;
                        case 'Pulmão':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRHomem/SeusExamesDeRastreioPulmaoMasculino';
                            break;
                        default:
                            console.error('Neoplasia desconhecida para homens');
                    }
                } else if (genero === 'mulher') {
                    switch (neoplasia) {
                        case 'Colo de Útero':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRMulher/SeusExamesDeRastreioColoDeUteroFeminino';
                            break;
                        case 'Mama':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRMulher/SeusExamesDeRastreioMamaFeminino';
                            break;
                        case 'Colorretal':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRMulher/SeusExamesDeRastreioColorretalFeminino';
                            break;
                        case 'Pulmão':
                            caminho = '/PerfilIndividual/SeusExamesDeRastreio/SEDRMulher/SeusExamesDeRastreioPulmaoFeminino';
                            break;
                        default:
                            console.error('Neoplasia desconhecida para mulheres');
                    }
                } else {
                    console.error('Gênero desconhecido');
                }

                if (caminho) {
                    router.push(caminho as Href<string>);
                }
            } else {
                console.error('Documento do usuário não encontrado');
            }
        } else {
            console.error('Usuário não está logado');
        }
    };

    const redirecionarParaSinaisESintomas = async () => {
        const user = authInstance.currentUser;

        if (user) {
            const userDocRef = doc(firestore, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const genero = userData.genero;


                if (genero && neoplasia) {

                    router.push({
                        pathname: `/PerfilIndividual/SinaisESintomas/SinaisESintomas`,
                        params: { sexo: genero, neoplasia },
                    });
                } else {
                    console.error('Dados de gênero ou neoplasia ausentes');
                }
            } else {
                console.error('Documento do usuário não encontrado');
            }
        } else {
            console.error('Usuário não está logado');
        }
    };



    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <LottieView
                source={require('../../assets/lottie/lupa2.json')}
                autoPlay
                loop={false}
                speed={3}
                style={styles.lottie}
            />
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaCalculoDeRisco}>
                <Text style={styles.buttonText}>Calcule seu Risco</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaExamesDeRastreio}>
                <Text style={styles.buttonText}>Seus exames de rastreio</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaSinaisESintomas}>
                <Text style={styles.buttonText}>Sinais e sintomas</Text>
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
        fontFamily: 'Quicksand-Bold',
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: 'Quicksand-Bold',
        backgroundColor: '#ff5721',
        borderRadius: 50,
        paddingHorizontal: 20,
        textAlign: 'center',
        lineHeight: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 10,
    },
    button: {
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
    },
    lottie: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
});
