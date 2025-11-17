import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons';

export const CameraPlusOutline = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24" {...props}>
        <path fill="#b76dfd" d="M21 6h-3.2L16 4h-6v2h5.1L17 8h4v12H5v-9H3v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2M8 14c0 4.45 5.39 6.69 8.54 3.54C19.69 14.39 17.45 9 13 9c-2.76 0-5 2.24-5 5m5-3a3.09 3.09 0 0 1 3 3a3.09 3.09 0 0 1-3 3a3.09 3.09 0 0 1-3-3a3.09 3.09 0 0 1 3-3M5 6h3V4H5V1H3v3H0v2h3v3h2"></path>
    </svg>
)

export default function ProfilePhotoPicker() {
    const [image, setImage] = useState<string | null>(null);
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(permissionResult);
        if (permissionResult.granted === false) {
            alert("Permission required, Please allow access to your photo library.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        console.log("result: ", result);

        if (!result.canceled && result.assets.length > 0 && result.assets[0].uri && result.assets[0].uri.length > 0) {
            setImage(result.assets[0].uri);
        }

    }

    const removeImage = async () => {
        setImage(null);
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
                <Text style={styles.placeholderText}>Add a Photo</Text>
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