import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  FlatList, 
  Image, 
  Pressable, 
  Modal, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Animated
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImageScreen from "./screens/ImageScreen";

const Stack = createNativeStackNavigator();

const GlassOverlay = ({ intensity = 10, style }) => (
  <View style={[styles.glassOverlay, { opacity: intensity * 0.1 }, style]} />
);

const AnimatedImage = ({ item, onPress, onLongPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.imageWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.imageContainer}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <View style={styles.imageOverlay} />
        <View style={styles.imageBorder} />
      </Pressable>
    </Animated.View>
  );
};

function GalleryScreen() {
  const [images, setImages] = useState([
    { id: "1", uri: "https://i.imgur.com/9n8MTr9.jpg" },
    { id: "2", uri: "https://imgur.com/25vQIqM.jpg" },
    { id: "3", uri: "https://imgur.com/Di3nhjW.jpg" },
    { id: "4", uri: "https://imgur.com/555IZEk.jpg" },
    { id: "5", uri: "https://imgur.com/9y7k6Z0.jpg" },
    { id: "6", uri: "https://imgur.com/iIfRxoz.jpg" },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLongPress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleDelete = () => {
    setImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <AnimatedImage
      item={item}
      onPress={() => navigation.navigate("ImageScreen", { uri: item.uri })}
      onLongPress={() => handleLongPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header estilo iOS */}
      <View style={styles.header}>
        <GlassOverlay intensity={15} />
        <Text style={styles.headerTitle}>Galeria</Text>
      </View>

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal estilo iOS com efeito de vidro */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <GlassOverlay intensity={20} />
          <View style={styles.modalContainer}>
            <View style={styles.modalGlass}>
              <Text style={styles.modalTitle}>Excluir imagem?</Text>
              <Text style={styles.modalSubtitle}>Esta ação não pode ser desfeita</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.btnCancel} 
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.btnGradientCancel}>
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                  <View style={styles.btnGradientDelete}>
                    <Text style={styles.btnDeleteText}>Excluir</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' }
        }}
      >
        <Stack.Screen name="Galeria" component={GalleryScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0A0A0A",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,25,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    textAlign: 'center',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(10, 132, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  grid: {
    padding: 8,
    paddingBottom: 20,
  },
  imageWrapper: {
    flex: 1,
    margin: 4,
  },
  imageContainer: {
    aspectRatio: 3/4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1E',
  },
  image: { 
    width: "100%", 
    height: "100%",
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(10, 132, 255, 0.2)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  modalContainer: {
    width: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,25,0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGlass: {
    padding: 24,
    borderRadius: 24,
  },
  modalTitle: { 
    color: "#FFFFFF", 
    fontSize: 18, 
    fontWeight: "700",
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: "500",
  },
  modalButtons: { 
    flexDirection: "row", 
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(10, 132, 255, 0.4)',
  },
  btnDelete: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  btnGradientCancel: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  btnGradientDelete: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FF453A',
    shadowColor: '#FF453A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  btnCancelText: { 
    color: "#0A84FF", 
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
  btnDeleteText: { 
    color: "#FFFFFF", 
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
});