import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { db } from '../../../config/firebase-config';

const IndicacoesRastreio: React.FC = () => {
    const { sexo, neoplasia } = useLocalSearchParams();
    const [texto, setTexto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchIndicacoes = async () => {
            try {
                const adminSnapshot = await getDocs(collection(db, 'administradores'));
                const adminIds = adminSnapshot.docs.map(doc => doc.id);

                console.log('IDs dos administradores:', adminIds);

                let indicacoesEncontradas = false;

                const sexoStr = Array.isArray(sexo) ? sexo[0] : sexo;
                const neoplasiaStr = Array.isArray(neoplasia) ? neoplasia[0] : neoplasia;

                for (const adminId of adminIds) {
                    const documentId = `${adminId}_${sexoStr?.toLowerCase()}_${neoplasiaStr?.toLowerCase()}`;
                    console.log('Tentando buscar documento com ID:', documentId);

                    const docRef = doc(db, 'indicacoesRastreio', documentId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log('Documento encontrado:', docSnap.data());
                        setTexto(docSnap.data().texto);
                        indicacoesEncontradas = true;
                        break;
                    } else {
                        console.log('Nenhum documento encontrado para o ID:', documentId);
                    }
                }

                if (!indicacoesEncontradas) {
                    setTexto("Nenhuma indicação encontrada.");
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar indicações de rastreio:', error);
                setLoading(false);
            }
        };

        if (sexo && neoplasia) {
            console.log('Parâmetros recebidos - Sexo:', sexo, 'Neoplasia:', neoplasia);
            fetchIndicacoes();
        } else {
            console.error('Dados de sexo ou neoplasia ausentes.');
        }
    }, [sexo, neoplasia]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            {/* Botão de voltar no topo esquerdo */}
            <TouchableOpacity
                style={{ position: 'absolute', top: 30, left: 20, zIndex: 10 }}
                onPress={() => router.back()}
            >
                <FontAwesome5 name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={[styles.title, { marginTop: 70 }]}>Indicações de Rastreio</Text>
            {texto ? (
                <Text style={styles.indicacaoText}>{texto}</Text>
            ) : (
                <Text style={styles.indicacaoText}>Nenhuma indicação encontrada.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232d97',
        paddingHorizontal: 20,
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
        marginTop: 30,
    },
    indicacaoText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Quicksand-Medium',
        marginTop: 20,
    },
});

export default IndicacoesRastreio;
