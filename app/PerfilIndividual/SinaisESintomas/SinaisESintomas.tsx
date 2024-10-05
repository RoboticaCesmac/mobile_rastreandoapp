import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config'; // Certifique-se de que o caminho para seu arquivo firebase está correto

const SinaisESintomas: React.FC = () => {
  const [sinaisSintomas, setSinaisSintomas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSinaisSintomas = async () => {
      try {
        // 1. Buscar IDs dos administradores
        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map(doc => doc.id); // Extrair os IDs dos administradores

        const allSintomasArray: any[] = [];

        // 2. Para cada administrador, buscar os sinais e sintomas na subcoleção 'combinacoes'
        for (const adminId of adminIds) {
          const combinacoesRef = collection(db, `sinaisSintomas/${adminId}/combinacoes`);
          const querySnapshot = await getDocs(combinacoesRef);
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            allSintomasArray.push({
              adminId: adminId, // Adiciona o ID do administrador para referência
              id: doc.id,       // ID da combinação (ex: 'homem_pulmao')
              sintomas: data.sintomas || [],
            });
          });
        }

        // 3. Atualizar o estado com todos os sinais e sintomas
        setSinaisSintomas(allSintomasArray);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar sinais e sintomas:', error);
        setLoading(false);
      }
    };

    fetchSinaisSintomas();
  }, []);

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

      <Text style={styles.title}>Sinais e Sintomas</Text>
      <FlatList
        data={sinaisSintomas}
        keyExtractor={(item) => item.adminId + item.id} // Usando o adminId + id da combinação como chave única
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              Administrador: {item.adminId} - Combinação: {item.id}
            </Text>
            <Text style={styles.sintomasText}>
              Sintomas: {item.sintomas.join(', ')}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232d97',  // Mesma cor de fundo
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',  // Cor branca como no título anterior
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',  // Fonte personalizada
  },
  item: {
    backgroundColor: '#3949AB',  // Mesma cor dos botões
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  itemText: {
    fontSize: 18,
    color: '#FFFFFF',  // Texto em branco
    fontFamily: 'Quicksand-Medium',  // Fonte personalizada
    marginBottom: 5,
  },
  sintomasText: {
    fontSize: 16,
    color: '#FFFFFF',  // Texto em branco para os sintomas
    fontFamily: 'Quicksand-Medium',
  },
});

export default SinaisESintomas;
