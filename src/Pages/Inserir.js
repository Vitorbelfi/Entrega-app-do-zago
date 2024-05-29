import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

export default function Inserir() {

    const [genero, setGenero] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    async function Cadastro() {
        if (!genero || !nome || !genero) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        await fetch('http://10.139.75.40/api/Client/InsertClient', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                clientEmail: email,
                clientName: nome,
                clientGenere: genero
            })
        })
            .then(res => (res.ok === true) ? res.json() : false)
            .then(json => { json.id ? setSucesso(true) : setErro(true) })
            .catch(() => setErro(true));

        setGenero('');
        setNome('');
        setEmail('');
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {sucesso ?
                <Text style={styles.sucesso}>Obrigado por se cadastrar. Seu cadastro foi realizado com sucesso</Text>
                :
                <>
                <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        onChangeText={(text) => setNome(text)}
                        placeholderTextColor="#ccc"
                        value={nome}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Gênero"
                        onChangeText={(text) => setGenero(text)}
                        placeholderTextColor="#ccc"
                        value={genero}
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        onChangeText={(text) => setEmail(text)}
                        placeholderTextColor="#ccc"
                        value={email}
                    />
                    <TouchableOpacity style={styles.botaoCadastrar} onPress={Cadastro}>
                        <Text style={styles.textoCadastrar}>Cadastrar</Text>
                    </TouchableOpacity>
                </>
            }
            {erro && <Text style={styles.texterro}>Revise cuidadosamente seus dados</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#191919",
        flexGrow: 1,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: '#333',
        width: '80%',
        height: 40,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        color: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
    },
    botaoCadastrar: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    textoCadastrar: {
        color: 'white',
        fontSize: 16,
    },
    sucesso: {
        color: "red",
    },
    erro: {
        color: "red",
    }
});
