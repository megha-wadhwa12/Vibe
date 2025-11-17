import { title } from 'process';
import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        // fontFamily: 'Plus Jakarta Sans, sans-serif'
    },
    form: {
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#9A89FF',
        borderRadius: 25,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
})