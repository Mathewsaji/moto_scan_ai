import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Shield, Zap, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await register(fullName, formData.email, formData.password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again.');
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
          
          <Text style={styles.brandName}>Join MotoScan AI</Text>
          <Text style={styles.tagline}>Start your professional vehicle analysis journey</Text>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Zap size={16} color="#10B981" />
              <Text style={styles.featureText}>AI Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={16} color="#10B981" />
              <Text style={styles.featureText}>Secure Data</Text>
            </View>
            <View style={styles.featureItem}>
              <Users size={16} color="#10B981" />
              <Text style={styles.featureText}>Expert Support</Text>
            </View>
          </View>
        </View>

        {/* Registration Form */}
        <BlurView intensity={Platform.OS === 'web' ? 0 : 20} style={styles.formContainer}>
          <View style={styles.formContent}>
            <View style={styles.formHeader}>
              <Text style={styles.welcomeTitle}>Create Your Account</Text>
              <Text style={styles.welcomeSubtitle}>
                Join thousands of professionals using MotoScan AI
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <CustomInput
                    label="First Name"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    placeholder="First name"
                    error={errors.firstName}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <CustomInput
                    label="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    placeholder="Last name"
                    error={errors.lastName}
                  />
                </View>
              </View>

              <CustomInput
                label="Email Address"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={errors.email}
              />

              <CustomInput
                label="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              
              <CustomInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                placeholder="Create a secure password"
                secureTextEntry
                error={errors.password}
              />

              <CustomInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <CustomButton
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                size="large"
              />
            </View>

            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Link href="/(auth)/login" style={styles.link}>
                  Sign In
                </Link>
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Trust indicators */}
        <View style={styles.trustSection}>
          <Text style={styles.trustText}>Join 50,000+ professionals worldwide</Text>
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>Free Trial</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>No Credit Card</Text>
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
    bottom: 200,
    left: -75,
  },
  shape3: {
    width: 100,
    height: 100,
    backgroundColor: '#F59E0B',
    top: height * 0.4,
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
    marginBottom: 32,
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
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    color: '#1E293B',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  termsSection: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#3B82F6',
    fontFamily: 'Inter-Bold',
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