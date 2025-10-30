import React from "react";
import { 
  View, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Pressable, 
  Text 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Componente de overlay para simular o efeito de blur
const GlassOverlay = ({ intensity = 10, style }) => (
  <View style={[styles.glassOverlay, { opacity: intensity * 0.1 }, style]} />
);

export default function ImageScreen({ route }) {
  const { uri } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header flutuante */}
      <View style={styles.header}>
        <GlassOverlay intensity={15} />
        <Pressable 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButtonGlass}>
            <Text style={styles.backButtonText}>‹</Text>
          </View>
        </Pressable>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Foto</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Imagem em tela cheia */}
      <Image source={{ uri }} style={styles.fullImage} resizeMode="contain" />
      
      {/* Footer com controles */}
      <View style={styles.footer}>
        <GlassOverlay intensity={15} />
        <View style={styles.footerControls}>
          <Pressable style={styles.footerButton}>
            <Text style={styles.footerButtonText}>♥</Text>
          </Pressable>
          <Pressable style={styles.footerButton}>
            <Text style={styles.footerButtonText}>↗</Text>
          </Pressable>
          <Pressable style={styles.footerButton}>
            <Text style={styles.footerButtonText}>⋯</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000000",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonGlass: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  fullImage: { 
    width: "100%", 
    height: "100%",
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingHorizontal: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  footerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
  },
});