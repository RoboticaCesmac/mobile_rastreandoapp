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
        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map((doc) => doc.id);
        console.log('IDs dos administradores:', adminIds);

        const allLocaisArray: any[] = [];

        for (const adminId of adminIds) {
          const docHomemRef = doc(db, `marqueConsulta/${adminId}_homem`);
          const docHomemSnap = await getDoc(docHomemRef);
          if (docHomemSnap.exists()) {
            const data = docHomemSnap.data();
            if (data.locais && Array.isArray(data.locais)) {
              console.log(`Locais encontrados para homem (adminId: ${adminId}):`, data.locais);
              allLocaisArray.push(...data.locais);
            } else {
              console.log(`Nenhum array de locais encontrado para marqueConsulta/${adminId}_homem`);
            }
          }

          const docMulherRef = doc(db, `marqueConsulta/${adminId}_mulher`);
          const docMulherSnap = await getDoc(docMulherRef);
          if (docMulherSnap.exists()) {
            const data = docMulherSnap.data();
            if (data.locais && Array.isArray(data.locais)) {
              console.log(`Locais encontrados para mulher (adminId: ${adminId}):`, data.locais);
              allLocaisArray.push(...data.locais);
            } else {
              console.log(`Nenhum array de locais encontrado para marqueConsulta/${adminId}_mulher`);
            }
          }
        }

        console.log('Todos os locais encontrados:', allLocaisArray);
        setLocais(allLocaisArray);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar locais de consulta:', error);
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
              <Text style={styles.link}>Acessar</Text>
            </TouchableOpacity>
            <Text style={styles.telefone}>Telefone: {item.telefone}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginTop: 30,
  },
  item: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  nome: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    color: '#FFD700',
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
