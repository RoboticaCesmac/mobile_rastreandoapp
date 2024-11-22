import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const fatoresDeRisco = [
  'Possui entre 40 e 74 anos',
  'História familiar de câncer de ovário, câncer de mama em homens, câncer de mama em mãe, irmã ou filha',
  'Realiza menos de 150min de atividade física por semana',
  'Primeira menstruação < 12 anos',
  'Menopausa > 45 anos',
  'Fuma ou já fumou',
  'Possui sobrepeso',
  'Nunca engravidou',
  'Fez ou faz uso de anticoncepcional oral ou terapia de reposição hormonal',
  'Nenhuma das anteriores'
];

const CalculeSeuRiscoMama = () => {
  const [selecoes, setSelecoes] = useState<boolean[]>(Array(fatoresDeRisco.length).fill(false));
  const [resultado, setResultado] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../../../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../../../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/Login/TelaLogin');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelecao = (index: number) => {
    const novasSelecoes = [...selecoes];
    if (index === fatoresDeRisco.length - 1) {
      novasSelecoes.fill(false);
      novasSelecoes[index] = true;
    } else {
      novasSelecoes[index] = !novasSelecoes[index];
      novasSelecoes[fatoresDeRisco.length - 1] = false;
    }
    setSelecoes(novasSelecoes);
  };

  const calcularRisco = async () => {
    const selecionados = selecoes.reduce((acc, selecionado, index) => {
      if (selecionado) acc.push(fatoresDeRisco[index]);
      return acc;
    }, [] as string[]);

    if (selecionados.length === 0) {
      Alert.alert('Aviso', 'Você ainda não selecionou nenhum item');
      return;
    }

    let resultadoTexto = '';

    if (selecionados.includes('Nenhuma das anteriores')) {
      resultadoTexto =
        'Você possui risco habitual para este tipo de câncer, porém, você ainda não possui indicação de iniciar o rastreio, converse com seu médico para entender quando ele deve iniciar e fique atento aos sinais e sintomas, aos fatores de risco e métodos de prevenção';
    } else if (selecionados.includes('História familiar de câncer de ovário, câncer de mama em homens, câncer de mama em mãe, irmã ou filha')) {
      resultadoTexto =
        'Pelas informações fornecidas, você possui alto risco para câncer de mama, procure um especialista para confirmar o seu alto risco e individualizar seus exames de rastreio.';
    } else if (selecionados.includes('Possui entre 40 e 74 anos')) {
      const fatoresAdicionais = selecionados.filter(
        (fator) => fator !== 'Possui entre 40 e 74 anos' && fator !== 'Nenhuma das anteriores'
      ).length;

      if (fatoresAdicionais === 0) {
        resultadoTexto =
          'Você possui risco habitual para este tipo de câncer e sua indicação de rastreio é a realização de mamografia anualmente';
      } else if (fatoresAdicionais === 1) {
        resultadoTexto =
          'Você possui risco habitual para este tipo de câncer e sua indicação de rastreio é a realização de mamografia anualmente';
      } else {
        resultadoTexto =
          'Você possui maior risco para este tipo de câncer, sua indicação de rastreio é a realização de mamografia anualmente, além de mudanças de hábitos de vida para reduzir seu risco, porém, não deixe de procurar um médico para avaliar a necessidade de outro método de rastreio';
      }
    } else {
      resultadoTexto =
        'Você possui risco habitual para este tipo de câncer, porém, é importante discutir com seu médico qual a melhor estratégia de rastreio.';
    }

    setResultado(resultadoTexto);
    setModalVisible(true);

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'usuarios', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const resultados = userData.resultado || [];
        const novoResultado = {
          tipo: 'Mama',
          resultado: resultadoTexto,
          data: new Date().toISOString()
        };

        const resultadosAtualizados = resultados.filter((res: any) => res.tipo !== 'Mama');
        resultadosAtualizados.push(novoResultado);

        await updateDoc(userDocRef, { resultado: resultadosAtualizados });
      }
    }
  };

  const handleOk = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>Marque as Informações Abaixo</Text>
      <Text style={styles.subTitle}>Mama</Text>
      {fatoresDeRisco.map((fator, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxContainer}
          onPress={() => handleSelecao(index)}
        >
          <View style={styles.checkbox}>
            {selecoes[index] && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>{fator}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={calcularRisco}>
        <Text style={styles.buttonText}>Calcular Risco</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{resultado}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleOk}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#232d97',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#3949AB',
    padding: 10,
    borderRadius: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ff5721',
    borderRadius: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: '#ff5721',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    flexShrink: 1,
  },
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3949AB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
});

export default CalculeSeuRiscoMama;
