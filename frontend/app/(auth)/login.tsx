import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Shield, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating geometric shapes */}
      <View style={[styles.floatingShape, styles.shape1]} />
      <View style={[styles.floatingShape, styles.shape2]} />
      <View style={[styles.floatingShape, styles.shape3]} />
      <View style={[styles.floatingShape, styles.shape1]} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
              style={styles.logoGradient}
            >
              <Car size={32} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>
          
          <Text style={styles.brandName}>MotoScan AI</Text>
          <Text style={styles.tagline}>AI-Powered Vehicle Analysis</Text>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Zap size={16} color="#10B981" />
              <Text style={styles.featureText}>Instant Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={16} color="#10B981" />
              <Text style={styles.featureText}>Secure & Private</Text>
            </View>
          </View>
        </View>

        {/* Login Form */}
        <BlurView intensity={Platform.OS === 'web' ? 0 : 20} style={styles.formContainer}>
          <View style={styles.formContent}>
            <View style={styles.formHeader}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to continue your vehicle analysis journey
              </Text>
            </View>

            <View style={styles.form}>
              <CustomInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={errors.email}
              />
              
              <CustomInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                size="large"
              />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                New to MotoScan AI  ?{' '}
                <Link href="/(auth)/register" style={styles.link}>
                  Create Account
                </Link>
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Trust indicators */}
        <View style={styles.trustSection}>
          {/* <Text style={styles.trustText}>Trusted by 50,000+ users worldwide</Text> */}
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>256-bit SSL</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>GDPR Compliant</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  shape1: {
    width: 200,
    height: 200,
    backgroundColor: '#3B82F6',
    top: -100,
    right: -100,
  },
  shape2: {
    width: 150,
    height: 150,
    backgroundColor: '#10B981',
    bottom: 100,
    left: -75,
  },
  shape3: {
    width: 100,
    height: 100,
    backgroundColor: '#F59E0B',
    top: height * 0.3,
    right: -50,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  formContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
    marginBottom: 32,
  },
  formContent: {
    padding: 32,
    backgroundColor: Platform.OS === 'web' ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111EAA',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  link: {
    color: '#3B82F6',
    fontFamily: 'Inter-Bold',
  },
  trustSection: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  trustBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trustBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
  },
});