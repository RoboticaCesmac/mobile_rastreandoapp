import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TelaDeHomeUsuario() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Image source={require('../assets/images/RASTREANDO.png')} style={styles.logo} />
            <TouchableOpacity style={styles.button} 
            onPress={() => router.push('/PerfilIndividual')}
            >
                <Text style={styles.buttonText}>Perfil Individual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} 
            onPress={() => router.push('/ProximosExames')}
            >
                <Text style={styles.buttonText}>Seus próximos exames</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} 
            onPress={() => router.push('/MarcarConsulta')}
            >
                <Text style={styles.buttonText}>Marque uma consulta</Text>
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
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
