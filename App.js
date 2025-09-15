import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, Touchable, ScrollView, TouchableOpacity, View } from 'react-native';
import Button from './src/components/Button';
import { styles } from './App.styles';
import { KeyboardAvoidingView } from 'react-native';
import { currencies } from './src/constants/currencies';
import { Input } from './src/components/input';
import ResultCard from './src/components/ResultCard';
import { exchangeRateApi } from './src/services/api';
import { useState } from 'react';
import { convertCurrency } from './src/utils/convertCurrency';
import { ActivityIndicator } from 'react-native';


export default function App() {

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");


  async function fetchExchangeRate() {
    try {
      setLoading(true);
      if (!amount) {
        return
      }
      const data = await exchangeRateApi(fromCurrency);
      const rate = data.rates[toCurrency];
      setExchangeRate(rate);
      const finalResult = convertCurrency(amount, rate);
      setResult(finalResult);
    } catch (error) {
      alert("Erro ao buscar taxa de câmbio")
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult("");
  }


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.content}>
          <StatusBar style="light" />

          <View style={styles.header}>
            <Text style={styles.title}>Conversor de Moedas</Text>
            <Text style={styles.subTitle}>Converta valores entre diferentes moedas</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>De:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map((currency, key) => (
                <Button key={key} variant='primary' onPress={() => setFromCurrency(currency.code)} isSelected={fromCurrency == currency.code} currency={currency} />
              ))}

            </View>

            <Input label="Valor: " value={amount} onChangeText={setAmount} />

            <TouchableOpacity onPress={swapCurrencies}  style={styles.swapButton}>
              <Text style={styles.swapButtonText}>
                ⇅
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>
              Para :
            </Text>

            <View style={styles.currencyGrid}>
              {currencies.map((currency, key) => (
                <Button key={key} variant='primary' onPress={() => setToCurrency(currency.code)} isSelected={toCurrency == currency.code} currency={currency} />
              ))}

            </View>
          </View>

          <TouchableOpacity
            style={[styles.convertButton, (loading || !amount) && styles.convertButtonDisabled]}
            disabled={loading || !amount}
            onPress={fetchExchangeRate}
          >
            {
              loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.swapButtonText}>
                  Converter
                </Text>
              )
            }
          </TouchableOpacity>


          <ResultCard exchangeRate={exchangeRate} result={result} fromCurrency={fromCurrency} toCurrency={toCurrency} currencies={currencies} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


