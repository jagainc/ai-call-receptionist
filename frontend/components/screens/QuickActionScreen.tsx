import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface QuickActionScreenProps {
    title: string;
    description: string;
}

export default function QuickActionScreen({ title, description }: QuickActionScreenProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const colors = {
        background: isDark ? '#000000' : '#FFFFFF',
        primaryText: isDark ? '#FFFFFF' : '#000000',
        secondaryText: isDark ? '#8E8E93' : '#666666',
        border: isDark ? '#2C2C2E' : '#E5E5E5',
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, {
                backgroundColor: colors.background,
                borderBottomColor: colors.border
            }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
                    {title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={[styles.content, { backgroundColor: colors.background }]}>
                <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
                    {description}
                </Text>
            </View>

            <View style={[styles.bottomPadding, { backgroundColor: colors.background }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    placeholderText: {
        fontSize: 16,
        textAlign: 'center',
    },
    bottomPadding: {
        height: 120,
    },
});