import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config'; // Certifique-se de que o caminho para seu arquivo firebase está correto

const CondutaManejoResultados: React.FC = () => {
  const { sexo, neoplasia } = useLocalSearchParams(); // Recebendo os parâmetros dinâmicos de sexo e neoplasia
  const [condutas, setCondutas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCondutas = async () => {
      try {
        const combinacao = `${sexo}_${neoplasia}`.toLowerCase(); // Converter para minúsculas
        console.log(`Buscando condutas para a combinação: ${combinacao}`);

        const condutasAgrupadas: { [key: string]: any[] } = {}; // Objeto para agrupar condutas por combinação

        // 1. Buscar IDs dos administradores
        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map(doc => doc.id); // Extrair os IDs dos administradores

        // 2. Para cada administrador, buscar as condutas de manejo na subcoleção 'combinacoes'
        for (const adminId of adminIds) {
          console.log(`Verificando dados para administrador: ${adminId}`);
          const combinacoesRef = collection(db, `condutaManejoResultado/${adminId}/combinacoes`);
          const querySnapshot = await getDocs(combinacoesRef);

          querySnapshot.forEach((doc) => {
            const docId = doc.id.toLowerCase();
            if (docId === combinacao) {
              console.log(`Dados encontrados para combinação: ${combinacao}`);
              const data = doc.data();
              if (condutasAgrupadas[docId]) {
                // Se já existe a combinação, concatenar as novas condutas e remover duplicatas
                const novasCondutas = data.itens.filter((item: any) =>
                  !condutasAgrupadas[docId].some((existingItem: any) => JSON.stringify(existingItem) === JSON.stringify(item))
                );
                condutasAgrupadas[docId] = [...condutasAgrupadas[docId], ...novasCondutas];
              } else {
                // Criar nova combinação com os itens
                condutasAgrupadas[docId] = data.itens || [];
              }
            }
          });
        }

        // 3. Converter o objeto agrupado em um array
        const condutasArray = Object.entries(condutasAgrupadas).map(([combinacao, itens]) => ({
          combinacao,
          itens,
        }));

        setCondutas(condutasArray);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar condutas de manejo:', error);
        setLoading(false);
      }
    };

    if (sexo && neoplasia) {
      fetchCondutas();
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
      <Text style={styles.title}>Conduta e Manejo</Text>
      <FlatList
        data={condutas}
        keyExtractor={(item) => item.combinacao} // Usando a combinação como chave única
        renderItem={({ item }) => (
          <View>
            {item.itens.map((conduta: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.description}>{conduta.resultado}</Text>
                <Text style={styles.description}>{conduta.descricao}</Text>
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
  description: {
    fontSize: 16,
    color: '#FFFFFF',  // Texto em branco para a descrição
    fontFamily: 'Quicksand-Medium',  // Fonte personalizada
    textAlign: 'center',
  },
});

export default CondutaManejoResultados;
