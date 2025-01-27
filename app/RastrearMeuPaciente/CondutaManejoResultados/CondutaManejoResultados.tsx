import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config';

const CondutaManejoResultados: React.FC = () => {
  const { sexo, neoplasia } = useLocalSearchParams();
  const [condutas, setCondutas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCondutas = async () => {
      try {
        const combinacao = `${sexo}_${neoplasia}`.toLowerCase();
        console.log(`Buscando condutas para a combinação: ${combinacao}`);

        const condutasAgrupadas: { [key: string]: any[] } = {};

        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map(doc => doc.id);

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
                const novasCondutas = data.itens.filter((item: any) =>
                  !condutasAgrupadas[docId].some((existingItem: any) => JSON.stringify(existingItem) === JSON.stringify(item))
                );
                condutasAgrupadas[docId] = [...condutasAgrupadas[docId], ...novasCondutas];
              } else {
                condutasAgrupadas[docId] = data.itens || [];
              }
            }
          });
        }

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
        keyExtractor={(item) => item.combinacao}
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
    backgroundColor: '#232d97',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
    backgroundColor: '#ff5721',
    borderRadius: 50,
    paddingHorizontal: 20,
    textAlign: 'center',
    lineHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    marginTop: 30,
  },
  item: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
  },
});

export default CondutaManejoResultados;
