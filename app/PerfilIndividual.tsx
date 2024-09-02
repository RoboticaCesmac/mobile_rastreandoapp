import { FontAwesome5 } from '@expo/vector-icons'; // Pacote de ícones
import { useRouter } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../config/firebase-config';

export default function PerfilIndividual() {
    const [escolha, setEscolha] = useState<string | null>(null);
    const router = useRouter();

    const confirmarEscolha = async () => {
        if (escolha) {
            // Pergunta ao usuário se ele deseja confirmar a escolha
            Alert.alert(
                'Confirmação',
                `Você tem certeza que deseja escolher ${escolha === 'mulher' ? 'Mulher' : 'Homem'}?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        onPress: async () => {
                            const user = auth.currentUser;
                            if (user) {
                                // Atualiza o perfil do usuário no Firebase com a escolha
                                const userRef = doc(db, "usuarios", user.uid);
                                await updateDoc(userRef, {
                                    genero: escolha,
                                });

                                // Redireciona para a tela correspondente
                                if (escolha === 'mulher') {
                                    router.push('/PerfilIndividualMulher');
                                } else {
                                    router.push('/PerfilIndividualHomem');
                                }
                            }
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Erro', 'Por favor, escolha uma opção antes de confirmar.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.title}>Escolha seu Perfil</Text>
            <TouchableOpacity
                style={[styles.optionButton, escolha === 'mulher' && styles.optionButtonSelected]}
                onPress={() => setEscolha('mulher')}>
                <FontAwesome5 name="female" size={24} color="white" />
                <Text style={styles.optionText}>Mulher</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.optionButton, escolha === 'homem' && styles.optionButtonSelected]}
                onPress={() => setEscolha('homem')}>
                <FontAwesome5 name="male" size={24} color="white" />
                <Text style={styles.optionText}>Homem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmarEscolha}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    optionButton: {
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
    optionButtonSelected: {
        backgroundColor: '#FF5722',
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
