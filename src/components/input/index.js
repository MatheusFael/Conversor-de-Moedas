import { TextInput, View, Text } from "react-native";
import { styles } from "./styles";

export function Input({ value, onChangeText, label }) {


    return (
        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                placeholder="0.00"
                keyboardType="numeric"
                onChangeText={onChangeText}
                placeholderTextColor="#94a3b8"
                value={value}
                style={styles.input}
            />

        </View>
    )
}