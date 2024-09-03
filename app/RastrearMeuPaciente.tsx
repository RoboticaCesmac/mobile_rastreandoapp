import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RastrearMeuPaciente() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>Quem Você Quer Rastrear?</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/RastrearMulher')}>
        <Ionicons name="female-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Mulher</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/RastrearHomem')}>
        <Ionicons name="male-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Homem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A237E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
