import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase-config';

export default function PerfilIndividualHomem() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/TelaLogin'); // Redireciona para a tela de login se o usuário não estiver autenticado
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
        <StatusBar hidden={true} />
            <Text style={styles.title}>Homem</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilInformacoesNeoplastia?neoplasia=Próstata')}>
            <FontAwesome5 name="male" size={24} color="white" />
                <Text style={styles.buttonText}>Próstata</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilInformacoesNeoplastia?neoplasia=Colorretal')}>
                <FontAwesome5 name="colon" size={24} color="white" />
                <Text style={styles.buttonText}>Colorretal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/PerfilInformacoesNeoplastia?neoplasia=Pulmão')}>
                <FontAwesome5 name="lungs" size={24} color="white" />
                <Text style={styles.buttonText}>Pulmão</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 10,
    },
});
