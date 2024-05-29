import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Busca() {
    const [clientes, setClientes ] = useState([]);
    const [error, setError ] = useState(false);
    const [busca, setBusca] = useState(false);
    const [filtro, setFiltro ] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [clientId, setClientId ] = useState("");
    const [clientNome, setNome] = useState('');
    const [clientEmail, setEmail] = useState('');
    const [clientGenere, setGenere] = useState('');

    async function getClientes() {
        await fetch('http://10.139.75.40/api/Client/GetAllPClients', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => setClientes(json))
        .catch(err => setError(true));
    }

    async function getCliente(id) {
        await fetch('http://10.139.75.40/api/Client/GetClientId/' + id, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response => response.json())
        .then(json => {
            setClientId(json.clientId);
            setNome(json.clientName);
            setEmail(json.clientEmail);
            setGenere(json.clientGenere);
        });
    }

    async function editClient() {
        await fetch('http://10.139.75.40/api/Client/UpdateClient/' + clientId, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                clientId: clientId,
                clientName: clientNome,
                clientEmail: clientEmail,
                clientGenere: clientGenere
            })
        })
        .then((response) => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
        getClientes();
        setEdicao(false);
    }

    function showAlert(id, clientName) {
        Alert.alert(
            '',
            'Deseja realmente excluir esse usuário?',
            [
                { text: 'Sim', onPress: () => deleteUsuario(id, clientName) },
                { text: 'Não', onPress: () => ('') },
            ],
            { cancelable: false }
        );
    }

    async function deleteUsuario(id, userName) {
        await fetch('http://10.139.75.40/api/Client/DeleteClient/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(res => res.json())
        .then(json => {
            if (json) {
                Alert.alert(
                    '',
                    'Usuário ' + userName + ' excluído com sucesso',
                    [{ text: 'OK', onPress: () => getClientes() }],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    '',
                    'Usuário ' + userName + ' não foi excluído.',
                    [{ text: 'OK', onPress: () => getClientes() }],
                    { cancelable: false }
                );
            }
        })
        .catch(err => setError(true));
    }

    useEffect(() => {
        getClientes();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getClientes();
        }, [])
    );

    return (
        <View style={styles.container}>
            {edicao == false ?
                <FlatList
                    style={styles.flat}
                    data={clientes}
                    keyExtractor={(item) => item.clientId}
                    renderItem={({ item }) => (
                        <View style={styles.clientContainer}>
                            <Text style={styles.clientName}>{item.clientName}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.btnEdit} onPress={() => { setEdicao(true); getCliente(item.clientId) }}>
                                    <Text style={styles.btnText}>EDITAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnDelete} onPress={() => showAlert(item.clientId, item.clientName)}>
                                    <Text style={styles.btnText}>EXCLUIR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                :
                <View style={styles.editar}>
                    <TextInput
                        inputMode="text"
                        style={styles.input}
                        value={clientNome}
                        onChangeText={(text) => setNome(text)}
                        placeholder="Nome"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        inputMode="email"
                        style={styles.input}
                        value={clientEmail}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        inputMode="text"
                        style={styles.input}
                        value={clientGenere}
                        onChangeText={(text) => setGenere(text)}
                        placeholder="Senha"
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity style={styles.btnSave} onPress={() => editClient()}>
                        <Text style={styles.btnSaveText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        alignItems: "center"
    },
    flat: {
        width: "100%",
    },
    clientContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    clientName: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    btnEdit: {
        backgroundColor: "#4CAF50",
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    btnDelete: {
        backgroundColor: "#f44336",
        padding: 5,
        borderRadius: 5,
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    },
    editar: {
        width: "100%",
        padding: 20,
    },
    input: {
        width: "100%",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
    },
    btnSave: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    btnSaveText: {
        color: "white",
        fontWeight: "bold",
    },
});
