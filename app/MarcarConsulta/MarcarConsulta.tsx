import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase-config';

const MarcarConsulta: React.FC = () => {
  const [locais, setLocais] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        // 1. Buscar IDs dos administradores
        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map((doc) => doc.id); // Extrair os IDs dos administradores
        console.log('IDs dos administradores:', adminIds); // Verificar se IDs estão corretos

        const allLocaisArray: any[] = [];

        // 2. Para cada administrador, buscar o array de locais tanto para 'homem' quanto para 'mulher'
        for (const adminId of adminIds) {
          // Buscar locais para homens
          const docHomemRef = doc(db, `marqueConsulta/${adminId}_homem`);
          const docHomemSnap = await getDoc(docHomemRef);
          if (docHomemSnap.exists()) {
            const data = docHomemSnap.data();
            if (data.locais && Array.isArray(data.locais)) {
              console.log(`Locais encontrados para homem (adminId: ${adminId}):`, data.locais);
              allLocaisArray.push(...data.locais); // Adiciona os locais ao array
            } else {
              console.log(`Nenhum array de locais encontrado para marqueConsulta/${adminId}_homem`);
            }
          }

          // Buscar locais para mulheres
          const docMulherRef = doc(db, `marqueConsulta/${adminId}_mulher`);
          const docMulherSnap = await getDoc(docMulherRef);
          if (docMulherSnap.exists()) {
            const data = docMulherSnap.data();
            if (data.locais && Array.isArray(data.locais)) {
              console.log(`Locais encontrados para mulher (adminId: ${adminId}):`, data.locais);
              allLocaisArray.push(...data.locais); // Adiciona os locais ao array
            } else {
              console.log(`Nenhum array de locais encontrado para marqueConsulta/${adminId}_mulher`);
            }
          }
        }

        console.log('Todos os locais encontrados:', allLocaisArray); // Log dos dados acumulados no array de locais
        // 3. Atualizar o estado com todos os locais de consulta
        setLocais(allLocaisArray);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar locais de consulta:', error); // Log do erro
        setLoading(false);
      }
    };

    fetchLocais();
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
      <Text style={styles.title}>Locais para Marcar Consulta</Text>
      <FlatList
        data={locais}
        keyExtractor={(item, index) => index.toString()} // Usar índice como chave única
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
              <Text style={styles.link}>Acessar</Text>
            </TouchableOpacity>
            <Text style={styles.telefone}>Telefone: {item.telefone}</Text>
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
  },
  item: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  nome: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    color: '#FFD700', // Cor para diferenciar o link
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  telefone: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
  },
});

export default MarcarConsulta;
