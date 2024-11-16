import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../config/firebase-config';

export default function ProximosExames() {
    const [proximosExames, setProximosExames] = useState<{ exame: string; date: string }[]>([]);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchProximosExames = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'usuarios', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log('Dados do usuário:', userData); // Log para verificar os dados do Firebase
                        const exames = [];

                        // Ajustando os campos de acordo com os nomes corretos
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

                        console.log('Próximos Exames:', exames); // Log para depuração
                        setProximosExames(exames);
                    } else {
                        console.log('Documento do usuário não encontrado.');
                    }
                } catch (error) {
                    console.error('Erro ao buscar exames:', error);
                }
            } else {
                console.log('Usuário não autenticado.');
            }
        };

        fetchProximosExames();
    }, [user]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <Text style={styles.title}>Próximos Exames</Text>

            <FlatList
                data={proximosExames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{item.exame}</Text>
                        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
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
    emptyText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Medium',
        textAlign: 'center',
        marginVertical: 10,
    },
});
