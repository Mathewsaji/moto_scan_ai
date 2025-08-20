import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Search, Calendar, DollarSign, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DamageDetectionService } from '@/services/damageDetectionService';
import { DamageAnalysis } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function HistoryScreen() {
  const [analyses, setAnalyses] = useState<DamageAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'damage' | 'no-damage'>('all');
  const { user, token } = useAuth();

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  const loadAnalysisHistory = async () => {
    if (!user || !token) return;
    
    try {
      const history = await DamageDetectionService.getAnalysisHistory(user.id, token);
      setAnalyses(history);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.damageType.some(damage => 
      damage.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'damage' && analysis.damageDetected) ||
      (selectedFilter === 'no-damage' && !analysis.damageDetected);
    
    return (searchQuery === '' || matchesSearch) && matchesFilter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner text="Loading analysis history..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>
          {analyses.length} total {analyses.length === 1 ? 'analysis' : 'analyses'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by damage location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'damage' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('damage')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'damage' && styles.filterButtonTextActive]}>
            With Damage
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'no-damage' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('no-damage')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'no-damage' && styles.filterButtonTextActive]}>
            No Damage
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredAnalyses.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No analyses found</Text>
            <Text style={styles.emptyStateMessage}>
              {searchQuery ? 'Try adjusting your search terms' : 'Start by taking a photo of your vehicle'}
            </Text>
          </View>
        ) : (
          filteredAnalyses.map((analysis) => (
            <View key={analysis.id} style={styles.analysisCard}>
              <Image source={{ uri: analysis.imageUri }} style={styles.analysisImage} />
              
              <View style={styles.analysisContent}>
                <View style={styles.analysisHeader}>
                  <Text style={styles.analysisDate}>{formatDate(analysis.analysisDate)}</Text>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>
                      {Math.round(analysis.confidence * 100)}% confident
                    </Text>
                  </View>
                </View>

                <View style={styles.statusContainer}>
                  {analysis.damageDetected ? (
                    <View style={styles.statusWithDamage}>
                      <AlertCircle size={16} color="#F59E0B" />
                      <Text style={styles.statusTextDamage}>Damage Detected</Text>
                    </View>
                  ) : (
                    <View style={styles.statusNoDamage}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={styles.statusTextNoDamage}>No Damage Found</Text>
                    </View>
                  )}
                </View>

                {analysis.damageDetected && (
                  <View style={styles.damageDetails}>
                    <Text style={styles.damageTitle}>Damage Types:</Text>
                    {analysis.damageType.map((damage, index) => (
                      <Text key={index} style={styles.damageItem}>
                        {`• ${damage.type} - ${damage.location} (${damage.severity})`}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.costContainer}>
                  <View style={styles.costRow}>
                    <DollarSign size={16} color="#6B7280" />
                    <Text style={styles.costLabel}>Estimated Cost:</Text>
                    <Text style={styles.costAmount}>
                      {formatCurrency(analysis.costEstimation.totalCost)}
                    </Text>
                  </View>
                  
                  {analysis.damageDetected && (
                    <View style={styles.costBreakdown}>
                      <Text style={styles.costBreakdownItem}>
                        Labor: {formatCurrency(analysis.costEstimation.laborCost)}
                      </Text>
                      <Text style={styles.costBreakdownItem}>
                        Parts: {formatCurrency(analysis.costEstimation.partsCost)}
                      </Text>
                      <Text style={styles.costBreakdownItem}>
                        Paint: {formatCurrency(analysis.costEstimation.paintCost)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisImage: {
    width: '100%',
    height: 200,
  },
  analysisContent: {
    padding: 16,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  confidenceContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#475569',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusWithDamage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusNoDamage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTextDamage: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  statusTextNoDamage: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  damageDetails: {
    marginBottom: 12,
  },
  damageTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  damageItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  costContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  costAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  costBreakdown: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  costBreakdownItem: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});