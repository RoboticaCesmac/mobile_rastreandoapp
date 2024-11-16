import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../../config/firebase-config';

export default function SeusExamesDeRastreioProstataMasculino() {
    const [proximoExame, setProximoExame] = useState<string | null>(null);
    const [examesAnteriores, setExamesAnteriores] = useState<{ exame: string; date: string }[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [exameSelecionado, setExameSelecionado] = useState<string | null>(null);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchExames = async () => {
            if (user) {
                const userDocRef = doc(db, 'usuarios', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProximoExame(userData.proximoExameProstata || null);
                    setExamesAnteriores(userData.examesAnterioresProstata || []);
                }
            }
        };
        fetchExames();
    }, [user]);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateConfirm = (date: Date) => {
        if (exameSelecionado) {
            Alert.alert(
                'Resultado do Exame',
                'O resultado foi Normal ou Alterado?',
                [
                    {
                        text: 'Normal',
                        onPress: () => registrarExame(date, 'Normal'),
                    },
                    {
                        text: 'Alterado',
                        onPress: () => {
                            Alert.alert('Atenção', 'Procure um médico para melhor investigação.');
                            registrarExame(date, 'Alterado');
                        },
                    },
                ]
            );
        }
        hideDatePicker();
    };

    const registrarExame = (date: Date, resultado: string) => {
        const formattedDate = date.toISOString();
        const novoExame = { exame: exameSelecionado || '', date: formattedDate };
        const examesAtualizados = [...examesAnteriores, novoExame];
        setExamesAnteriores(examesAtualizados);

        let dataProximoExame: string | null = null;

        if (resultado === 'Normal') {
            const proximaData = new Date(date);
            proximaData.setFullYear(proximaData.getFullYear() + 1);
            dataProximoExame = proximaData.toISOString();
            setProximoExame(dataProximoExame);
        }

        if (user) {
            const userDocRef = doc(db, 'usuarios', user.uid);
            const updateData: any = {
                examesAnterioresProstata: examesAtualizados,
            };

            if (dataProximoExame) {
                updateData.proximoExameProstata = dataProximoExame;
            }

            updateDoc(userDocRef, updateData).catch((error) => {
                console.error('Erro ao atualizar os dados no Firebase:', error);
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            
            <View style={styles.header}>
                <Text style={styles.title}>Seus Exames de Rastreio - Próstata</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={openModal}>
                <Text style={styles.buttonText}>Registrar Exame</Text>
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Exames Prévios</Text>
                <FlatList
                    data={examesAnteriores}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Text style={styles.listItem}>{`${item.exame} - ${formatDate(item.date)}`}</Text>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exame registrado.</Text>}
                />
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Próximos Exames</Text>
                <Text style={styles.nextExamText}>
                    {proximoExame
                        ? `PSA anualmente - ${formatDate(proximoExame)}`
                        : 'Nenhuma data marcada'}
                </Text>
            </View>

            {/* Modal para seleção de exame */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Exame</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setExameSelecionado('PSA anualmente');
                                showDatePicker();
                                closeModal();
                            }}
                        >
                            <Text style={styles.modalButtonText}>PSA anualmente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={closeModal}>
                            <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Date Picker */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
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
    header: {
        backgroundColor: '#232d97',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Quicksand-Bold',
    },
    button: {
        backgroundColor: '#ff5721',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Bold',
        marginBottom: 10,
    },
    listItem: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Medium',
        marginBottom: 5,
    },
    nextExamText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Quicksand-Medium',
        textAlign: 'center',
        marginVertical: 10,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Medium',
        textAlign: 'center',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Quicksand-Bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#3949AB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Bold',
    },
    modalCancelButton: {
        marginTop: 10,
    },
    modalCancelButtonText: {
        color: '#3949AB',
        fontSize: 16,
        fontFamily: 'Quicksand-Bold',
    },
});
