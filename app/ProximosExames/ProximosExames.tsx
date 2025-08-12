import { MaterialIcons } from '@expo/vector-icons'; // Certifique-se de instalar @expo/vector-icons
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Para detectar o foco no componente
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';

export default function ProximosExames() {
    const router = useRouter();
    const [proximosExames, setProximosExames] = useState<{ exame: string; date: string }[]>([]);
    const user = auth.currentUser;

    const fetchProximosExames = async () => {
        if (user) {
            try {
                const userDocRef = doc(db, 'usuarios', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('Dados do usuário recuperados do Firestore:', userData);

                    const exames = [];

                    if (userData.proximoExamePulmao) {
                        exames.push({
                            exame: 'Tomografia Computadorizada (Pulmão)',
                            date: userData.proximoExamePulmao,
                        });
                    }

                    if (userData.proximoExameColorretal) {
                        exames.push({
                            exame: 'Colonoscopia (Colorretal)',
                            date: userData.proximoExameColorretal,
                        });
                    }

                    if (userData.proximoExameMama) {
                        exames.push({
                            exame: 'Mamografia (Mama)',
                            date: userData.proximoExameMama,
                        });
                    }

                    if (userData.proximoExameColoDeUtero) {
                        exames.push({
                            exame: 'Citologia Oncótica (Colo de Útero)',
                            date: userData.proximoExameColoDeUtero,
                        });
                    }

                    if (userData.proximoExameProstata) {
                        exames.push({
                            exame: 'PSA (Próstata)',
                            date: userData.proximoExameProstata,
                        });
                    }

                    console.log('Exames formatados para exibição:', exames);

                    setProximosExames(exames);
                } else {
                    console.log('Nenhum documento encontrado para o usuário no Firestore.');
                }
            } catch (error) {
                console.error('Erro ao buscar exames do Firestore:', error);
            }
        } else {
            console.log('Usuário não autenticado.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchProximosExames();
        }, [user])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const excluirExame = async (index: number) => {
        if (!user) return;

        const exameRemovido = proximosExames[index];
        const novosExames = proximosExames.filter((_, i) => i !== index);

        try {
            const userDocRef = doc(db, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const updates: any = {};

                if (exameRemovido.exame.includes('Pulmão')) {
                    updates.proximoExamePulmao = null;
                } else if (exameRemovido.exame.includes('Colorretal')) {
                    updates.proximoExameColorretal = null;
                } else if (exameRemovido.exame.includes('Mama')) {
                    updates.proximoExameMama = null;
                } else if (exameRemovido.exame.includes('Colo de Útero')) {
                    updates.proximoExameColoDeUtero = null;
                } else if (exameRemovido.exame.includes('Próstata')) {
                    updates.proximoExameProstata = null;
                }

                await updateDoc(userDocRef, updates);
                setProximosExames(novosExames);
                Alert.alert('Sucesso', 'Exame excluído com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao excluir exame:', error);
            Alert.alert('Erro', 'Não foi possível excluir o exame. Tente novamente.');
        }
    };

    const confirmarExclusao = (index: number) => {
        Alert.alert(
            'Excluir Exame',
            'Tem certeza que deseja excluir este exame?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => excluirExame(index) },
            ]
        );
    };

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

            <Text style={[styles.title, { marginTop: 70 }]}>Próximos Exames</Text>

            <FlatList
                data={proximosExames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemTitle}>{item.exame}</Text>
                            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => confirmarExclusao(index)}
                        >
                            <MaterialIcons name="delete" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum próximo exame agendado.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232d97',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Quicksand-Bold',
        marginBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3949AB',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
        marginBottom: 5,
    },
    itemDate: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Medium',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Medium',
        textAlign: 'center',
        marginVertical: 10,
    },
});
