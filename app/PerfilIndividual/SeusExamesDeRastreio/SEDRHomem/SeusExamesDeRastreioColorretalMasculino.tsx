import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../../config/firebase-config';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function SeusExamesDeRastreioColorretalMasculino() {
    const router = useRouter();
    const [proximoExame, setProximoExame] = useState<string | null>(null);
    const [examesAnteriores, setExamesAnteriores] = useState<{ exame: string; date: string; photo?: string }[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [exameSelecionado, setExameSelecionado] = useState<string | null>(null);
    const user = auth.currentUser;

    useEffect(() => {
        const solicitarPermissoes = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permissão Negada',
                    'Permita o acesso à galeria para registrar exames.',
                    [{ text: 'OK' }]
                );
            }
        };
        solicitarPermissoes();
    }, []);

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

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
    const openImageModal = (uri: string | undefined) => {
        if (uri) {
            console.log('Imagem clicada:', uri);
            setSelectedImageUri(uri);
            setImageModalVisible(true);
        } else {
            Alert.alert('Erro', 'A imagem selecionada não é válida.');
        }
    };

    const closeImageModal = () => setImageModalVisible(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateConfirm = (date: Date) => {
        const today = new Date();

        if (date > today) {
            Alert.alert(
                'Data Inválida',
                'Você não pode registrar uma data futura para o exame.',
                [{ text: 'OK', onPress: hideDatePicker }]
            );
            return;
        }

        if (exameSelecionado) {
            Alert.alert(
                'Resultado do Exame',
                'O resultado foi Normal ou Alterado?',
                [
                    {
                        text: 'Normal',
                        onPress: () => solicitarFoto(date, 'Normal'),
                    },
                    {
                        text: 'Alterado',
                        onPress: () => {
                            Alert.alert('Atenção', 'Procure um médico para melhor investigação.');
                            solicitarFoto(date, 'Alterado');
                        },
                    },
                ]
            );
        }
        hideDatePicker();
    };

    const solicitarFoto = async (date: Date, resultado: string) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir acesso à galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0].uri) {
            registrarExame(date, resultado, result.assets[0].uri);
        } else {
            Alert.alert('Foto não adicionada', 'Nenhuma foto foi selecionada.');
        }
    };

    const registrarExame = (date: Date, resultado: string, photoUri?: string) => {
        const formattedDate = date.toISOString();
        const novoExame = { exame: exameSelecionado || '', date: formattedDate, photo: photoUri || '' };
        const examesAtualizados = [...examesAnteriores, novoExame];
        setExamesAnteriores(examesAtualizados);

        if (resultado === 'Normal') {
            const dataProximoExame = new Date(date);
            dataProximoExame.setFullYear(dataProximoExame.getFullYear() + 10);
            setProximoExame(dataProximoExame.toISOString());
        }

        if (user) {
            const userDocRef = doc(db, 'usuarios', user.uid);
            updateDoc(userDocRef, {
                proximoExameColorretal: proximoExame,
                examesAnterioresColorretal: examesAtualizados,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <StatusBar hidden={true} />
            <View style={{ height: 40 }} />
            <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.title}>Seus Exames de Rastreio - Colorretal</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={openModal}>
                <Text style={styles.buttonText}>Registrar Exame</Text>
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Exames Prévios</Text>
                <FlatList
                    data={examesAnteriores}
                    keyExtractor={(item, index) => index.toString()}
                    nestedScrollEnabled={true} // Permite rolagem aninhada
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Clicou no item:', item); // Diagnóstico
                                if (item.photo) {
                                    openImageModal(item.photo); // Abre o modal com a foto
                                } else {
                                    console.log('Sem imagem');
                                }
                            }}
                            activeOpacity={0.7}
                            style={styles.listItem}
                        >
                            <View style={styles.row}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.listText}>
                                        {`${item.exame} - ${formatDate(item.date)}`}
                                    </Text>
                                </View>
                                {item.photo && (
                                    <Image source={{ uri: item.photo }} style={styles.image} />
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exame registrado.</Text>}
                />




            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Próximos Exames</Text>
                <Text style={styles.nextExamText}>
                    {proximoExame
                        ? `Colonoscopia - ${formatDate(proximoExame)}`
                        : 'Nenhuma data marcada'}
                </Text>
            </View>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Exame</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setExameSelecionado('Colonoscopia');
                                showDatePicker();
                                closeModal();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Colonoscopia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={closeModal}>
                            <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
            />

            {/* Modal para exibir imagem ampliada */}
            <Modal visible={isImageModalVisible} transparent={true} onRequestClose={closeImageModal}>
                <View style={styles.imageModalContainer}>
                    {selectedImageUri && (
                        <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
                    )}
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232d97',
        padding: 20,
    },
    header: {
        paddingVertical: 10,
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
    scrollContainer: {
        flexGrow: 1, // Garante que o conteúdo possa ser rolado
        padding: 20, // Espaçamento interno
        backgroundColor: '#232d97', // Mantém o fundo azul
    },
    sectionTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Bold',
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row', // Alinha os itens na horizontal
        alignItems: 'center', // Centraliza verticalmente
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#ffffff10', // Fundo translúcido para contraste
        borderRadius: 8,
    },
    listText: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    nextExamText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 16,
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
    imageModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#ff5721',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand-Bold',
    },

    row: {
        flexDirection: 'row', // Itens na mesma linha
        alignItems: 'center', // Centraliza verticalmente
        justifyContent: 'space-between', // Espaço entre os elementos
        flex: 1,
    },
    textContainer: {
        flex: 1, // Garante que o texto ocupe o espaço disponível
        marginRight: 10, // Espaçamento entre texto e imagem
    },
    backButtonTop: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#ff5721',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
});
