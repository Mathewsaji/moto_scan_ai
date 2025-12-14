import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, RotateCcw, X, Check, Loader, Zap, Shield, Target } from 'lucide-react-native';
import { CustomButton } from '@/components/CustomButton';
import { DamageDetectionService } from '@/services/damageDetectionService';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { user, token } = useAuth();

  if (!permission) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.backgroundGradient}
        />
        <Text style={styles.message}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.backgroundGradient}
        />
        <View style={styles.permissionContainer}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.permissionIcon}
          >
            <Camera size={48} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            MotoScan AI needs camera access to capture and analyze vehicle damage photos with our advanced AI technology.
          </Text>
          
          <View style={styles.permissionFeatures}>
            <View style={styles.permissionFeature}>
              <Shield size={16} color="#10B981" />
              <Text style={styles.permissionFeatureText}>Secure & Private</Text>
            </View>
            <View style={styles.permissionFeature}>
              <Zap size={16} color="#10B981" />
              <Text style={styles.permissionFeatureText}>Instant Analysis</Text>
            </View>
          </View>
          
          <CustomButton
            title="Grant Camera Access"
            onPress={requestPermission}
            size="large"
          />
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const analyzeImage = async () => {
    if (!capturedImage || !user || !token) return;

    setIsAnalyzing(true);
    try {
      const analysis = await DamageDetectionService.analyzeImage(capturedImage, token);
      
      // Navigate to results screen with analysis data
      router.push({
        pathname: './analysis-result',
        params: { analysisId: analysis.id }
      });
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
            style={styles.previewOverlay}
          >
            <View style={styles.previewHeader}>
              <TouchableOpacity style={styles.backButton} onPress={retakePhoto}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.previewTitle}>Review Photo</Text>
              <View style={styles.placeholder} />
            </View>
            
            <View style={styles.previewContent}>
              <Text style={styles.previewMessage}>
                Make sure the damage is clearly visible and well-lit for accurate AI analysis
              </Text>
              
              <View style={styles.analysisFeatures}>
                <View style={styles.analysisFeature}>
                  <Target size={16} color="#10B981" />
                  <Text style={styles.analysisFeatureText}>Precision Detection</Text>
                </View>
                <View style={styles.analysisFeature}>
                  <Zap size={16} color="#10B981" />
                  <Text style={styles.analysisFeatureText}>Instant Results</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <X size={20} color="#64748B" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <View style={styles.analyzeButtonContainer}>
              <CustomButton
                title={isAnalyzing ? 'Analyzing...' : 'Analyze Damage'}
                onPress={analyzeImage}
                loading={isAnalyzing}
                size="large"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.overlay}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Capture Damage</Text>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={toggleCameraFacing}
            >
              <RotateCcw size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.guidanceContainer}>
            <View style={styles.targetFrame}>
              <View style={[styles.targetCorner, styles.topLeft]} />
              <View style={[styles.targetCorner, styles.topRight]} />
              <View style={[styles.targetCorner, styles.bottomLeft]} />
              <View style={[styles.targetCorner, styles.bottomRight]} />
            </View>
            
            <View style={styles.guidanceContent}>
              <Text style={styles.guidanceText}>
                Position damage within the frame
              </Text>
              <Text style={styles.guidanceSubtext}>
                Ensure good lighting and clear visibility
              </Text>
              
              <View style={styles.guidanceTips}>
                <View style={styles.guidanceTip}>
                  <Shield size={14} color="#10B981" />
                  <Text style={styles.guidanceTipText}>Hold steady</Text>
                </View>
                <View style={styles.guidanceTip}>
                  <Zap size={14} color="#10B981" />
                  <Text style={styles.guidanceTipText}>Good lighting</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.captureContainer}>
            <View style={styles.captureControls}>
              <View style={styles.captureButtonWrapper}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.captureButtonGradient}
                  >
                    <View style={styles.captureButtonInner} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  topBarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  guidanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  targetFrame: {
    width: width * 0.8,
    height: width * 0.6,
    position: 'relative',
    marginBottom: 40,
  },
  targetCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#3B82F6',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  guidanceContent: {
    alignItems: 'center',
  },
  guidanceText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  guidanceSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  guidanceTips: {
    flexDirection: 'row',
    gap: 20,
  },
  guidanceTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guidanceTipText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  captureContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  captureControls: {
    alignItems: 'center',
  },
  captureButtonWrapper: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  message: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  permissionTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionFeatures: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  permissionFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permissionFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  analysisFeatures: {
    flexDirection: 'row',
    gap: 24,
  },
  analysisFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analysisFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  analyzeButtonContainer: {
    flex: 2,
  },
});