import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase-config';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o spinner
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Iniciar o spinner

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setLoading(false); // Parar o spinner
        const user = userCredential.user;
        Alert.alert('Login realizado com sucesso!');
        router.push('/TelaDeHomeUsuario'); // Redirecionar para a tela de home
      })
      .catch((error) => {
        setLoading(false); // Parar o spinner em caso de erro
        console.error(error);
        Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais e tente novamente.');
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#AAA"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#AAA"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" /> // Spinner de carregamento
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A237E', // Azul escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
