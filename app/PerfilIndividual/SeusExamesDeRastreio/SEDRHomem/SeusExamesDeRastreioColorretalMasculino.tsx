import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../../config/firebase-config';

export default function SeusExamesDeRastreioColorretalMasculino() {
    const [proximoExame, setProximoExame] = useState<string | null>(null);
    const [examesAnteriores, setExamesAnteriores] = useState<{ date: string }[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchExames = async () => {
            if (user) {
                const userDocRef = doc(db, 'usuarios', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProximoExame(userData.proximoExameColorretal);
                    setExamesAnteriores(userData.examesAnterioresColorretal || []);
                }
            }
        };
        fetchExames();
    }, [user]);

    const handleConfirm = (date: Date) => {
        const updatedExames = [...examesAnteriores, { date: date.toISOString() }];
        setExamesAnteriores(updatedExames);
        setProximoExame(date.toISOString());

        if (user) {
            const userDocRef = doc(db, 'usuarios', user.uid);
            updateDoc(userDocRef, {
                proximoExameColorretal: date.toISOString(),
                examesAnterioresColorretal: updatedExames
            });
        }
        hideDatePicker();
    };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    return (
        <View style={styles.container}>
                        <StatusBar hidden={true} />

            <Text style={styles.title}>Seus Exames de Rastreio - Colorretal</Text>
            <Text style={styles.subtitle}>Próximo: {proximoExame ? new Date(proximoExame).toLocaleDateString() : 'Nenhuma data marcada'}</Text>

            <TouchableOpacity style={styles.button} onPress={showDatePicker}>
                <Text style={styles.buttonText}>Marcar Próximo Exame</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.subtitle}>Exames Anteriores:</Text>
            <FlatList
                data={examesAnteriores}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.listItem}>{new Date(item.date).toLocaleDateString()}</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#232d97', padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, color: '#fff', marginBottom: 20, fontFamily: 'Quicksand-Bold' },
    subtitle: { fontSize: 18, color: '#fff', marginBottom: 10, fontFamily: 'Quicksand-Medium' },
    button: { backgroundColor: '#3949AB', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginVertical: 20, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Quicksand-Bold' },
    listItem: { color: '#fff', fontSize: 16, fontFamily: 'Quicksand-Medium', marginBottom: 10 }
});
