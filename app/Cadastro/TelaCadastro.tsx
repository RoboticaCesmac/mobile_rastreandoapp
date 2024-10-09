import * as EmailValidator from 'email-validator';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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


const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const isValidDate = (date: string): boolean => {
  const [day, month, year] = date.split('/').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;

  const today = new Date();
  const parsedDate = new Date(year, month - 1, day);
  if (parsedDate >= today) return false;

  return true;
};




export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const router = useRouter();

  const handleCadastro = () => {
    if (!nome || !email || !cpf || !dataNascimento || !senha || !confirmarSenha || !tipoUsuario) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!EmailValidator.validate(email)) {
      Alert.alert('Erro', 'Por favor, insira um endereço de email válido.');
      return;
    }

    if (!isValidCPF(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido.');
      return;
    }

    if (!isValidDate(dataNascimento)) {
      Alert.alert('Erro', 'Por favor, insira uma data de nascimento válida.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          nome,
          email,
          cpf,
          dataNascimento,
          tipoUsuario,
        });

        await sendEmailVerification(user);

        setLoading(false);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Verifique seu email.');
        router.push('/paginaInicial');
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            mask: '99/99/9999',
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
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
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
          <ActivityIndicator size="large" color="#FF5722" />
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
    backgroundColor: '#FF5722',
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
