import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../../config/firebase-config';

export default function SeusExamesDeRastreioPulmaoMasculino() {
    const [proximoExame, setProximoExame] = useState<string | null>(null);
    const [examesAnteriores, setExamesAnteriores] = useState<{ date: string; resultado: string }[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isRiskModalVisible, setRiskModalVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [resultado, setResultado] = useState<string>('');
    const user = auth.currentUser;

    useEffect(() => {
        const fetchExames = async () => {
            if (user) {
                const userDocRef = doc(db, 'usuarios', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProximoExame(userData.proximoExamePulmao);
                    setExamesAnteriores(userData.examesAnterioresPulmao || []);
                }
            }
        };
        fetchExames();
    }, [user]);

    const handleConfirm = (date: Date) => {
        setSelectedDate(date); // Armazena a data selecionada
        setRiskModalVisibility(true); // Exibe o modal para escolher o tipo de risco
        hideDatePicker();
    };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const hideRiskModal = () => setRiskModalVisibility(false);

    const handleRiskChoice = (choice: string) => {
        let finalDate = selectedDate;

        if (choice === 'riscoElevado' && selectedDate) {
            // Calcula o próximo exame para 10 anos no futuro
            finalDate = new Date(selectedDate);
            finalDate.setFullYear(finalDate.getFullYear() + 10);
        }

        if (finalDate) {
            const updatedExames = [...examesAnteriores, { date: finalDate.toISOString(), resultado }];
            setExamesAnteriores(updatedExames);
            setProximoExame(finalDate.toISOString());

            if (user) {
                const userDocRef = doc(db, 'usuarios', user.uid);
                updateDoc(userDocRef, {
                    proximoExamePulmao: finalDate.toISOString(),
                    examesAnterioresPulmao: updatedExames
                });
            }
        }

        setResultado(''); // Limpa o campo de resultado após adicionar o exame
        hideRiskModal();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 ao mês, pois janeiro é 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <StatusBar hidden={true} />

                {/* Título Principal */}
                <Text style={styles.title}>Seus Exames de Rastreio - Pulmão</Text>

                {/* Próximo Exame */}
                <Text style={styles.subtitle}>
                    Próximo: {proximoExame ? formatDate(proximoExame) : 'Nenhuma data marcada'}
                </Text>

                {/* Lista de Exames Anteriores com Colunas para Exame e Resultado */}
                {examesAnteriores.map((exame, index) => (
                    <View key={index} style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.columnTitle}>Tomografia Computadorizada</Text>
                            <Text style={styles.columnContent}>{formatDate(exame.date)}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.columnTitle}>Resultado</Text>
                            <Text style={styles.columnContent}>{exame.resultado || 'Não informado'}</Text>
                        </View>
                    </View>
                ))}

                {/* Botão para Adicionar Novo Exame */}
                <TouchableOpacity style={styles.button} onPress={showDatePicker}>
                    <Text style={styles.buttonText}>Adicionar Novo Exame</Text>
                </TouchableOpacity>

                {/* Modal para Escolha de Risco */}
                <Modal visible={isRiskModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Escolha o tipo de risco:</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => handleRiskChoice('riscoElevado')}>
                            <Text style={styles.modalButtonText}>Risco Elevado (Próximo exame em 10 anos)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => handleRiskChoice('riscoHabitual')}>
                            <Text style={styles.modalButtonText}>Risco Habitual (Sem necessidade de rastreio)</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite o resultado do exame"
                            value={resultado}
                            onChangeText={setResultado}
                        />
                    </View>
                </Modal>

                {/* Seletor de Data */}
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#232d97', padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, color: '#fff', marginBottom: 20, fontFamily: 'Quicksand-Bold' },
    subtitle: { fontSize: 18, color: '#fff', marginBottom: 10, fontFamily: 'Quicksand-Medium' },
    button: { backgroundColor: '#3949AB', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginVertical: 20, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Quicksand-Bold' },
    row: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between', width: '100%' },
    column: { flex: 1, marginHorizontal: 10 },
    columnTitle: { fontSize: 16, color: '#fff', fontFamily: 'Quicksand-Bold', marginBottom: 5 },
    columnContent: { fontSize: 16, color: '#fff', fontFamily: 'Quicksand-Medium' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalTitle: { fontSize: 20, color: '#fff', marginBottom: 20 },
    modalButton: { backgroundColor: '#3949AB', padding: 10, borderRadius: 10, marginVertical: 10, width: '80%', alignItems: 'center' },
    modalButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Quicksand-Bold' },
    textInput: { backgroundColor: '#fff', width: '80%', borderRadius: 10, padding: 10, marginTop: 20 }
});
