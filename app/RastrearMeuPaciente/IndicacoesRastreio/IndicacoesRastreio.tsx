import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'; // Adicionar 'doc' e 'getDoc'
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config';

const IndicacoesRastreio: React.FC = () => {
    const { sexo, neoplasia } = useLocalSearchParams(); // Pegando os parâmetros passados
    const [texto, setTexto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchIndicacoes = async () => {
            try {
                // 1. Buscar IDs dos administradores
                const adminSnapshot = await getDocs(collection(db, 'administradores'));
                const adminIds = adminSnapshot.docs.map(doc => doc.id); // Extrair os IDs dos administradores

                console.log('IDs dos administradores:', adminIds); // Log para verificar IDs dos administradores

                let indicacoesEncontradas = false;

                // 2. Garantir que 'sexo' e 'neoplasia' são strings antes de usá-los
                const sexoStr = Array.isArray(sexo) ? sexo[0] : sexo;
                const neoplasiaStr = Array.isArray(neoplasia) ? neoplasia[0] : neoplasia;

                // 3. Para cada administrador, buscar o documento que combina com {IDdoAdm}_{sexo}_{neoplasia}
                for (const adminId of adminIds) {
                    const documentId = `${adminId}_${sexoStr?.toLowerCase()}_${neoplasiaStr?.toLowerCase()}`;
                    console.log('Tentando buscar documento com ID:', documentId); // Log para verificar o ID do documento gerado

                    const docRef = doc(db, 'indicacoesRastreio', documentId); // Busca o documento diretamente com o ID composto
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log('Documento encontrado:', docSnap.data()); // Log para exibir os dados encontrados
                        setTexto(docSnap.data().texto); // Definir o texto da indicação
                        indicacoesEncontradas = true;
                        break; // Parar a busca se encontrar a indicação
                    } else {
                        console.log('Nenhum documento encontrado para o ID:', documentId); // Log para verificar se não encontrou
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
            console.log('Parâmetros recebidos - Sexo:', sexo, 'Neoplasia:', neoplasia); // Log para verificar os parâmetros recebidos
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

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.title}>Indicações de Rastreio</Text>
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
