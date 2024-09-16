import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase-config';




export default function RastrearMulher() {
    
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/Login/TelaLogin'); // Redireciona para TelaLogin se não estiver autenticado
            }
        });
    }, []);

    
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            {/* Botão Mudar */}
            <TouchableOpacity style={styles.changeButton} onPress={() => router.push('/RastrearMeuPaciente/RastrearMeuPaciente')}>
                <FontAwesome5 name="arrow-left" size={15} color="white" style={styles.iconMudar} />
                <Text style={styles.changeButtonText}>Trocar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mulher</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/RastrearMeuPaciente/RastrearPacienteNeoplastia?neoplasia=Colo de Útero')}>
                <FontAwesome5 name="" size={24} color="white" />
                <Text style={styles.buttonText}>Colo de Útero</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/RastrearMeuPaciente/RastrearPacienteNeoplastia?neoplasia=Mama')}>
                <FontAwesome5 name="" size={24} color="white" />
                <Text style={styles.buttonText}>Mama</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/RastrearMeuPaciente/RastrearPacienteNeoplastia?neoplasia=Colorretal')}>
                <FontAwesome5 name="" size={24} color="white" />
                <Text style={styles.buttonText}>Colorretal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/RastrearMeuPaciente/RastrearPacienteNeoplastia?neoplasia=Pulmão')}>
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
    },
    changeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: -2,
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
    iconMudar: {
        marginRight: 8,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
});