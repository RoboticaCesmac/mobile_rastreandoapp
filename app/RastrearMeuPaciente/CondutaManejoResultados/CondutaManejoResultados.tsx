import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config'; // Certifique-se de que o caminho para seu arquivo firebase está correto

const CondutaManejoResultados: React.FC = () => {
  const [sinaisFatores, setSinaisFatores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSinaisFatores = async () => {
      try {
        // 1. Buscar IDs dos administradores
        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map(doc => doc.id); // Extrair os IDs dos administradores

        const allFatoresArray: any[] = [];

        // 2. Para cada administrador, buscar os sinais de alarme e fatores de risco na subcoleção 'combinacoes'
        for (const adminId of adminIds) {
          const combinacoesRef = collection(db, `condutaManejoResultado/${adminId}/combinacoes`);
          const querySnapshot = await getDocs(combinacoesRef);
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            allFatoresArray.push({
              adminId: adminId, // Adiciona o ID do administrador para referência
              id: doc.id,       // ID da combinação (ex: 'homem_pulmao')
              sinais: data.itens || [],  // Assumindo que o campo é 'itens'
            });
          });
        }

        // 3. Atualizar o estado com todos os sinais de alarme e fatores de risco
        setSinaisFatores(allFatoresArray);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar condutas:', error);
        setLoading(false);
      }
    };

    fetchSinaisFatores();
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

      <Text style={styles.title}>Conduta e Manejo</Text>
      <FlatList
        data={sinaisFatores}
        keyExtractor={(item) => item.adminId + item.id} // Usando o adminId + id da combinação como chave única
        renderItem={({ item }) => (
          <View>
            {item.sinais.map((sinal: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.description}>{sinal.resultado}</Text>
                <Text style={styles.description}>{sinal.descricao}</Text>
              </View>
            ))}
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
    alignItems: 'center',  // Centralizando o conteúdo
  },
  image: {
    width: '100%',
    height: 200,  // Ajuste de altura da imagem
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',  // Texto em branco para a descrição
    fontFamily: 'Quicksand-Medium',  // Fonte personalizada
    textAlign: 'center',
  },
});

export default CondutaManejoResultados;
