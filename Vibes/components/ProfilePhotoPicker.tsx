import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons';
import { useSignup } from '@/contexts/SignupContext';

export default function ProfilePhotoPicker() {
    const { signupData, updateSignupData } = useSignup();
    const image = signupData.profilePhoto;

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission required, Please allow access to your photo library.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0 && result.assets[0].uri) {
            updateSignupData({ profilePhoto: result.assets[0].uri });
        }
    }

    const removeImage = () => {
        updateSignupData({ profilePhoto: null });
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={pickImage} style={styles.imageWrapper}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="person" size={40} color="#b76dfd" />
                        {/* <CameraPlusOutline /> */}
                    </View>
                )}
            </Pressable>
            {!image && (
                <Text style={styles.placeholderText}>Add a photo</Text>
            )}

            {image && (
                <Pressable onPress={removeImage}>
                    <Text style={styles.removeText}>Remove Photo</Text>
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: "#b1a1f3ff",
        borderStyle: "dashed",
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: "#F5F5F5",
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#575555ff',
    },
    image: {
        width: '100%',
        height: '100%'
    },
    removeText: {
        color: "#FF6B6B",
        fontSize: 14,
        marginTop: 8
    }
})