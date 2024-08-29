import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Máscara para CPF e Data
import { auth, db } from '../config/firebase-config';

export default function TelaCadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');

    const handleCadastro = () => {
        if (!nome || !email || !cpf || !dataNascimento || !senha || !tipoUsuario) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

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

                Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            })
            .catch((error) => {
                Alert.alert('Erro', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
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
                    <Text style={styles.tipoButtonText}>População Geral</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tipoButton,
                        tipoUsuario === 'saude' ? styles.tipoButtonSelected : null,
                    ]}
                    onPress={() => setTipoUsuario('saude')}>
                    <Text style={styles.tipoButtonText}>Profissional de Saúde</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#1A237E',
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    tipoButton: {
        flex: 1,
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    tipoButtonSelected: {
        backgroundColor: '#303F9F',
    },
    tipoButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3949AB',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
