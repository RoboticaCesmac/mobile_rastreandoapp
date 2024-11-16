import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config';

const SinaisESintomas: React.FC = () => {
  const { sexo, neoplasia } = useLocalSearchParams();
  const [sinaisSintomas, setSinaisSintomas] = useState<{ combinacao: string; sintomas: string[] }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSinaisSintomas = async () => {
      try {
        const sintomasAgrupados: { [key: string]: string[] } = {};

        if (sexo && neoplasia) {
          const combinacao = `${sexo}_${neoplasia}`.toLowerCase();
          console.log(`Buscando sintomas para combinação: ${combinacao}`);

          const adminSnapshot = await getDocs(collection(db, 'administradores'));
          const adminIds = adminSnapshot.docs.map(doc => doc.id);

          for (const adminId of adminIds) {
            console.log(`Verificando combinação para administrador: ${adminId}`);
            const combinacoesRef = collection(db, `sinaisSintomas/${adminId}/combinacoes`);
            const querySnapshot = await getDocs(combinacoesRef);

            querySnapshot.forEach((doc) => {
              if (doc.id.toLowerCase() === combinacao) {
                console.log(`Sintomas encontrados para ${combinacao}:`, doc.data().sintomas);
                const data = doc.data();
                if (sintomasAgrupados[combinacao]) {
                  sintomasAgrupados[combinacao] = [...sintomasAgrupados[combinacao], ...data.sintomas];
                } else {
                  sintomasAgrupados[combinacao] = data.sintomas || [];
                }
              }
            });
          }

          const allSintomasArray = Object.entries(sintomasAgrupados).map(([combinacao, sintomas]) => ({
            combinacao,
            sintomas: Array.from(new Set(sintomas)),
          }));

          console.log("Sintomas agrupados final:", allSintomasArray);

          setSinaisSintomas(allSintomasArray);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar sinais e sintomas:', error);
        setLoading(false);
      }
    };

    fetchSinaisSintomas();
  }, [sexo, neoplasia]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (sinaisSintomas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum sintoma encontrado para {sexo} - {neoplasia}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Text style={styles.title}>Sinais e Sintomas para {sexo} - {neoplasia}</Text>
      <FlatList
        data={sinaisSintomas}
        keyExtractor={(item, index) => `${item.combinacao}_${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.sintomasText}>Sintomas: {item.sintomas.join('; ')}</Text>
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
  itemText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 5,
  },
  sintomasText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
  },
});

export default SinaisESintomas;
