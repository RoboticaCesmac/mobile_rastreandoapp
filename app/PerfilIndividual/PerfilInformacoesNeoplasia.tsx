import { useFonts } from 'expo-font';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';

const firestore = getFirestore();
const authInstance = getAuth();

export default function PerfilInformacoesNeoplasia() {
    const router = useRouter();
    const { neoplasia } = useLocalSearchParams(); // Pega o nome da neoplasia da URL
    const [title, setTitle] = useState<string>('');
    const [fontsLoaded] = useFonts({
        'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/Login/TelaLogin'); // Redireciona para a tela de login se o usuário não estiver autenticado
            }
        });

        // Define o título da tela baseado no parâmetro passado
        if (neoplasia) {
            console.log("Neoplasia capturada da URL:", neoplasia); // Adiciona o console.log para visualizar o valor capturado
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

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaCalculoDeRisco}>
                <Text style={styles.buttonText}>Calcule seu Risco</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Seus exames de rastreio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
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
    },
    button: {
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        paddingHorizontal: 30,
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
});