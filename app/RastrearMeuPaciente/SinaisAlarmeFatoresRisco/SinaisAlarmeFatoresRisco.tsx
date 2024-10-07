import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../config/firebase-config';

const SinaisAlarmeFatoresRisco: React.FC = () => {
  const { sexo, neoplasia } = useLocalSearchParams();
  const [sinaisFatores, setSinaisFatores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSinaisFatores = async () => {
      try {
        const combinacao = `${sexo}_${neoplasia}`.toLowerCase();
        console.log(`Buscando dados para combinação: ${combinacao}`);

        const sintomasAgrupados: any[] = [];

        const adminSnapshot = await getDocs(collection(db, 'administradores'));
        const adminIds = adminSnapshot.docs.map(doc => doc.id);

        for (const adminId of adminIds) {
          console.log(`Verificando dados para administrador: ${adminId}`);
          const combinacoesRef = collection(db, `sinaisAlarmeFatoresRisco/${adminId}/combinacoes`);
          const querySnapshot = await getDocs(combinacoesRef);

          querySnapshot.forEach((doc) => {
            if (doc.id.toLowerCase() === combinacao) {
              console.log(`Dados encontrados para combinação: ${combinacao}`);
              const data = doc.data();
              sintomasAgrupados.push({
                adminId: adminId,
                id: doc.id,
                sinais: data.sintomas || [],
              });
            }
          });
        }

        setSinaisFatores(sintomasAgrupados);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar sinais de alarme e fatores de risco:', error);
        setLoading(false);
      }
    };

    if (sexo && neoplasia) {
      fetchSinaisFatores();
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

      <Text style={styles.title}>Sinais de Alarme e Fatores de Risco</Text>
      <FlatList
        data={sinaisFatores}
        keyExtractor={(item) => item.adminId + item.id}
        renderItem={({ item }) => (
          <View>
            {item.sinais.map((sinal: any, index: number) => (
              <View key={index} style={styles.item}>
                <Image
                  source={{ uri: sinal.imagem }}
                  style={styles.image}
                  resizeMode="cover"
                />
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
  },
});

export default SinaisAlarmeFatoresRisco;
