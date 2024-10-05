import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';

const firestore = getFirestore();

export default function RastrearPacienteNeoplasia() {
    const router = useRouter();
    const { neoplasia } = useLocalSearchParams(); // Pegando o parâmetro 'neoplasia' da URL
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
            setTitle(neoplasia as string);
        }

        return () => unsubscribe();
    }, [neoplasia]);

    if (!fontsLoaded) {
        return null; // Retorna nada enquanto as fontes não carregarem
    }

    const redirecionarParaSinaisAlarmeFatoresRisco = async () => {
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(firestore, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const genero = userData.genero;

                // Redirecionar para a página de SinaisAlarmeFatoresRisco com os parâmetros corretos
                if (genero && neoplasia) {
                    router.push({
                        pathname: `/RastrearMeuPaciente/SinaisAlarmeFatoresRisco/SinaisAlarmeFatoresRisco`,
                        params: { sexo: genero, neoplasia }, // Passa os parâmetros dinâmicos
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

    const redirecionarParaIndicacoesRastreio = async () => {
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(firestore, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const genero = userData.genero;

                // Redirecionar para a página de Indicações de Rastreio com os parâmetros corretos
                if (genero && neoplasia) {
                    router.push({
                        pathname: `/RastrearMeuPaciente/IndicacoesRastreio/IndicacoesRastreio`,
                        params: { sexo: genero, neoplasia }, // Passa os parâmetros dinâmicos
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
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaSinaisAlarmeFatoresRisco}>
                <Text style={styles.buttonText}>Sinais de Alarme e Fatores de Risco</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={redirecionarParaIndicacoesRastreio}>
                <Text style={styles.buttonText}>Indicações de Rastreio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Conduta e Manejo Após Resultados</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232d97',  // Cor de fundo padronizada
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: 'Quicksand-Bold',  // Fonte personalizada
    },
    button: {
        backgroundColor: '#3949AB',  // Mesma cor dos botões quadrados
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 20,  // Bordas arredondadas como os botões quadrados
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        fontFamily: 'Quicksand-Bold',  // Fonte personalizada
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',  // Fonte personalizada
        textAlign: 'center',
    },
});
