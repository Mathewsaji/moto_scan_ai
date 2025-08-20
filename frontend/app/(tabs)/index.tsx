import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, Scan, Clock, IndianRupeeIcon, CircleCheck as CheckCircle, TrendingUp, Shield, Zap, ChartBar as BarChart3 } from 'lucide-react-native';
import { CustomButton } from '@/components/CustomButton';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [recentAnalyses] = useState([
    {
      id: '1',
      imageUri: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '2 hours ago',
      damageDetected: true,
      cost: 450,
      location: 'Front Bumper',
      severity: 'Moderate',
    },
    {
      id: '2',
      imageUri: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '1 day ago',
      damageDetected: false,
      cost: 0,
      location: 'Side Panel',
      severity: 'None',
    },
  ]);

  const handleQuickScan = () => {
    router.push('/(tabs)/camera');
  };

  const handleUploadImage = () => {
    Alert.alert('Upload Image', 'Gallery access would be implemented here');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.headerGradient}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{user?.firstName}!</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.profileGradient}
              >
                <Text style={styles.profileInitial}>
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Ready to analyze your vehicle?</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryActionButton} onPress={handleQuickScan}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.actionGradient}
              >
                <Camera size={28} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.primaryActionText}>Scan Damage</Text>
                <Text style={styles.primaryActionSubtext}>Take a photo</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryActionButton} onPress={handleUploadImage}>
              <Upload size={24} color="#3B82F6" strokeWidth={2.5} />
              <Text style={styles.secondaryActionText}>Upload Image</Text>
              <Text style={styles.secondaryActionSubtext}>From gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Dashboard */}
        <View style={styles.analyticsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Analytics</Text>
            <TouchableOpacity>
              <BarChart3 size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#EBF4FF', '#DBEAFE']}
                style={styles.statIconContainer}
              >
                <Scan size={24} color="#3B82F6" strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={styles.statTrendText}>+2 this week</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.statIconContainer}
              >
                <IndianRupeeIcon size={24} color="#10B981" strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.statNumber}>₹2,450</Text>
              <Text style={styles.statLabel}>Est. Savings</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={styles.statTrendText}>+₹450 saved</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#F3E8FF', '#E9D5FF']}
                style={styles.statIconContainer}
              >
                <CheckCircle size={24} color="#8B5CF6" strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Issues Found</Text>
              <View style={styles.statTrend}>
                <Shield size={12} color="#8B5CF6" />
                <Text style={styles.statTrendText}>67% accuracy</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Analyses */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentAnalyses.map((analysis) => (
            <TouchableOpacity key={analysis.id} style={styles.analysisCard}>
              <Image source={{ uri: analysis.imageUri }} style={styles.analysisImage} />
              <View style={styles.analysisContent}>
                <View style={styles.analysisHeader}>
                  <View>
                    <Text style={styles.analysisLocation}>{analysis.location}</Text>
                    <Text style={styles.analysisDate}>{analysis.date}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    analysis.damageDetected ? styles.damageDetected : styles.noDamage
                  ]}>
                    <View style={[
                      styles.statusDot,
                      analysis.damageDetected ? styles.damageDot : styles.noDamageDot
                    ]} />
                    <Text style={[
                      styles.statusText,
                      analysis.damageDetected ? styles.damageText : styles.noDamageText
                    ]}>
                      {analysis.damageDetected ? 'Damage Found' : 'No Issues'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.analysisDetails}>
                  <View style={styles.analysisDetailItem}>
                    <Text style={styles.detailLabel}>Severity</Text>
                    <Text style={[
                      styles.detailValue,
                      analysis.severity === 'Moderate' ? styles.moderateSeverity : styles.noneSeverity
                    ]}>
                      {analysis.severity}
                    </Text>
                  </View>
                  {analysis.damageDetected && (
                    <View style={styles.analysisDetailItem}>
                      <Text style={styles.detailLabel}>Est. Cost</Text>
                      <Text style={styles.costValue}>₹{analysis.cost}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.insightIconContainer}
            >
              <Zap size={24} color="#F59E0B" strokeWidth={2.5} />
            </LinearGradient>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Maintenance Tip</Text>
              <Text style={styles.insightText}>
                Based on your recent scans, consider checking your front bumper alignment. 
                Early detection can save up to 40% on repair costs.
              </Text>
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
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  userName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  profileButton: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginTop: 8,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    gap: 16,
  },
  primaryActionButton: {
    borderRadius: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  actionGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  primaryActionSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE',
    marginTop: 4,
  },
  secondaryActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryActionText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
  },
  secondaryActionSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  analyticsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  seeAllLink: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  analysisImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  analysisContent: {
    flex: 1,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  analysisLocation: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  analysisDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  damageDetected: {
    backgroundColor: '#FEF3C7',
  },
  noDamage: {
    backgroundColor: '#D1FAE5',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  damageDot: {
    backgroundColor: '#F59E0B',
  },
  noDamageDot: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  damageText: {
    color: '#92400E',
  },
  noDamageText: {
    color: '#065F46',
  },
  analysisDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  analysisDetailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  moderateSeverity: {
    color: '#F59E0B',
  },
  noneSeverity: {
    color: '#10B981',
  },
  costValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  insightsSection: {
    paddingHorizontal: 24,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
});