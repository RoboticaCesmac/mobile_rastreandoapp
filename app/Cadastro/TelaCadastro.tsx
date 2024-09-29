import * as EmailValidator from 'email-validator';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { auth, db } from '../../config/firebase-config';

export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const router = useRouter();

  const handleCadastro = () => {
    if (!nome || !email || !cpf || !dataNascimento || !senha || !tipoUsuario) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!EmailValidator.validate(email)) {
      Alert.alert('Erro', 'Por favor, insira um endereço de email válido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true); // Iniciar o spinner

    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Salvar dados adicionais no Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          nome,
          email,
          cpf,
          dataNascimento,
          tipoUsuario,
        });

        setLoading(false); // Parar o spinner
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.push('/paginaInicial'); // Redirecionar para a Tela de Home
      })
      .catch((error) => {
        setLoading(false); // Parar o spinner
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Ajuste para iOS
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar hidden={true} />
        <TouchableOpacity style={styles.titleDiv}>
            <Text style={styles.title}>Cadastre-se</Text>
          </TouchableOpacity>
          
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInputMask
          type={'cpf'}
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInputMask
          type={'custom'}
          options={{
            mask: '99/99/9999', // Máscara para data
          }}
          style={styles.input}
          placeholder="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'populacao' ? styles.tipoButtonSelected : null,
            ]}
            onPress={() => setTipoUsuario('populacao')}>
            <Text
              style={[
                styles.tipoButtonText,
                tipoUsuario === 'populacao' ? styles.tipoButtonTextSelected : null,
              ]}
            >
              População Geral
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'saude' ? styles.tipoButtonSelected : null,
            ]}
            onPress={() => setTipoUsuario('saude')}>
            <Text
              style={[
                styles.tipoButtonText,
                tipoUsuario === 'saude' ? styles.tipoButtonTextSelected : null,
              ]}
            >
              Profis. da Saúde
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF5722" /> // Spinner de carregamento
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#232d97',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
    fontFamily: 'Quicksand-Bold',
    alignContent: 'center',
  },
  tipoButton: {
    flex: 1,
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
    display: 'flex',
  },
  tipoButtonSelected: {
    backgroundColor: '#FF5722', // Cor alterada para indicar o botão selecionado
  },
  tipoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Quicksand-Medium',
    alignItems: 'center',

  },
  tipoButtonTextSelected: {
    fontFamily: 'Quicksand-Bold',
  },
  button: {
    backgroundColor: '#3949AB',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    fontFamily: 'Quicksand-Bold',
  },
  titleDiv: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
});