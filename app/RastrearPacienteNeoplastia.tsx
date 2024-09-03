import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase-config';

export default function RastrearPacienteNeoplastia() {
    const router = useRouter();
    const { neoplasia } = useLocalSearchParams(); // Pega o nome da neoplasia da URL
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/TelaLogin'); // Redireciona para a tela de login se o usuário não estiver autenticado
            }
        });

        // Define o título da tela baseado no parâmetro passado
        if (neoplasia) {
            setTitle(neoplasia as string);
        }

        return () => unsubscribe();
    }, [neoplasia]);

    return (
        <View style={styles.container}>
        <StatusBar hidden={true} />
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sinais de Alarme e Fatores de Risco</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
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
        backgroundColor: '#1A237E',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
});
