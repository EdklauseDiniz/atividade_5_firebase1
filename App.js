import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  SafeAreaView, StyleSheet, ActivityIndicator, ScrollView,
  Image
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUkNyyrb7s_7H1Cqalyaj9nDHpnzj0HAs",
  authDomain: "fir-atividade4.firebaseapp.com",
  projectId: "fir-atividade4",
  storageBucket: "fir-atividade4.firebasestorage.app",
  messagingSenderId: "376112453653",
  appId: "1:376112453653:web:4e006dc4c1adcbd1b9161c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.appWrapper}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerTitleAlign: 'center'}}/>
            <Stack.Screen name="Cadastro" component={Cadastro} options={{headerTitleAlign: 'center'}}/>
            <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} options={{headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    if (!email || !senha) {
      return Alert.alert('Erro', 'Preencha todos os campos!');
    }
    if (senha.length < 6) {
      return setErro('A senha deve ter pelo menos 6 caracteres.');
    }
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.replace('TelaPrincipal');
      })
      .catch((error) => {
        console.log(error);
        setErro(error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Criar Conta</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={cadastrar}><Text style={styles.buttonText}>Cadastrar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Login')}><Text style={styles.linkText}>Já tem conta? Login</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = () => {
    if (!email || !senha) return setErro('Preencha todos os campos');
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => navigation.replace('TelaPrincipal'))
      .catch(() => setErro("Email ou senha errada"));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Bem-vindo</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={login}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Cadastro')}><Text style={styles.linkText}>Criar conta</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPrincipal() {
  const [cotacoes, setCotacoes] = useState([]);
  const [atualizadoEm, setAtualizadoEm] = useState('');
  const [carregando, setCarregando] = useState(false);

  const getBandeiraUrl = (codigo) => {
    const bandeira = codigo.substring(0, 2).toLowerCase();
    return 'https://flagcdn.com/w40/'+bandeira+'.png' || 'https://flagcdn.com/w40/un.png';
  };

  const buscarCotacoes = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch('https://economia.awesomeapi.com.br/json/all');
      const dados = await resposta.json();
      const agora = new Date();
      setAtualizadoEm(`${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`);
      const moedasPermitidas = ['USD', 'EUR', 'BRL'];
      const listaMoedas = Object.keys(dados)
       
        .map(key => ({
          codigo: key,
          nome: dados[key].name,
          valor: parseFloat(dados[key].bid).toFixed(2),
          bandeiraUrl: getBandeiraUrl(dados[key].code)
        }));
      setCotacoes(listaMoedas);
    } catch {
      Alert.alert('Erro', 'Falha ao buscar');
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => { buscarCotacoes(); }, []);

  return (
    <SafeAreaView style={tp.safeArea}>

      {/* Hero Header */}
      <View style={tp.hero}>
        <View style={tp.heroBadge}>
          <Text style={tp.heroBadgeText}>AO VIVO</Text>
        </View>
        <Text style={tp.heroTitle}>Câmbio</Text>
        <Text style={tp.heroSubtitle}>Cotações em tempo real</Text>
      </View>

      <View style={tp.body}>

        {/* Timestamp pill */}
        <View style={tp.timestampRow}>
          <View style={tp.dot} />
          <Text style={tp.timestampText}>
            {atualizadoEm ? `Atualizado em ${atualizadoEm}` : 'Buscando cotações...'}
          </Text>
        </View>

        {/* Cards */}
        {carregando ? (
          <View style={tp.loaderWrap}>
            <ActivityIndicator size="large" color="#C9A84C" />
            <Text style={tp.loaderText}>Carregando...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {cotacoes.map((m, i) => (
              <View key={i} style={tp.card}>
                <View style={tp.cardLeft}>
                  <Image source={{ uri: m.bandeiraUrl }} style={tp.bandeira} />
                  <View>
                    <Text style={tp.moedaNome}>{m.nome}</Text>
                    <View style={tp.codigoPill}>
                      <Text style={tp.codigoText}>{m.codigo}</Text>
                    </View>
                  </View>
                </View>
                <View style={tp.cardRight}>
                  <Text style={tp.valorLabel}>BRL</Text>
                  <Text style={tp.valor}>R$ {m.valor}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Update Button */}
        <TouchableOpacity
          style={[tp.botao, carregando && tp.botaoDisabled]}
          onPress={buscarCotacoes}
          disabled={carregando}
          activeOpacity={0.8}
        >
          <Text style={tp.botaoTexto}>
            {carregando ? 'Atualizando...' : 'Atualizar Cotações'}
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

export default App;

// ─── Estilos das telas de Login / Cadastro ────────────────────────────────────
const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0'
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: '#f5f7fa'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    borderColor: '#dcdde1',
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    marginTop: 10,
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center'
  },
});

// ─── Estilos exclusivos da TelaPrincipal ─────────────────────────────────────
const DARK = '#0D0F14';
const SURFACE = '#161A23';
const CARD_BG = '#1C2130';
const BORDER = '#2A3045';
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C96A';
const TEXT_PRIMARY = '#F0EDE6';
const TEXT_MUTED = '#8A8FA8';

const tp = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: SURFACE,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    alignItems: 'flex-start',
  },
  heroBadge: {
    backgroundColor: GOLD,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#0D0F14',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -1,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  // ── Timestamp ─────────────────────────────────────────────────────────────
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3DBA78',
  },
  timestampText: {
    fontSize: 12,
    color: TEXT_MUTED,
    letterSpacing: 0.2,
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bandeira: {
    width: 42,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  moedaNome: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 5,
  },
  codigoPill: {
    backgroundColor: '#252B3B',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  codigoText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  valorLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    letterSpacing: 1,
    marginBottom: 3,
  },
  valor: {
    fontSize: 22,
    fontWeight: '700',
    color: GOLD_LIGHT,
    letterSpacing: -0.5,
  },

  // ── Loader ────────────────────────────────────────────────────────────────
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loaderText: {
    color: TEXT_MUTED,
    fontSize: 14,
  },

  // ── Botão ─────────────────────────────────────────────────────────────────
  botao: {
    backgroundColor: GOLD,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  botaoDisabled: {
    opacity: 0.5,
  },
  botaoTexto: {
    color: '#0D0F14',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});