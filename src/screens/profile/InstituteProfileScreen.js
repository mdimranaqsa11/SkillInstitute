import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { getInstituteProfile, updateInstituteProfile } from '../../api/institute';
import { ApiError } from '../../api/client';

export default function InstituteProfileScreen({ navigation }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canEdit = can(user, 'editInstituteProfile');

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await getInstituteProfile();
      setForm(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = key => value => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateInstituteProfile(form);
      showAlert('Saved', 'Institute profile updated.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Institute Profile" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Institute Profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Icon name="badge" size={18} color={colors.primary} />
          </View>
          <Text style={styles.section}>Basic Info</Text>
        </View>
        <Input label="Legal Name" value={form.legal_name || ''} onChangeText={set('legal_name')} editable={canEdit} />
        <Input
          label="Registration Number"
          value={form.registration_number || ''}
          onChangeText={set('registration_number')}
          editable={canEdit}
        />
        <Input
          label="Established Year"
          keyboardType="numeric"
          value={form.established_year ? String(form.established_year) : ''}
          onChangeText={v => set('established_year')(v ? Number(v) : null)}
          editable={canEdit}
        />

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconWrap, { backgroundColor: `${colors.secondary}1A` }]}>
            <Icon name="description" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.section}>Description</Text>
        </View>
        <Input
          label="About the institute"
          placeholder="What does this institute do?"
          value={form.description || ''}
          onChangeText={set('description')}
          editable={canEdit}
          multiline
          numberOfLines={4}
        />

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconWrap, { backgroundColor: `${colors.tertiary}1A` }]}>
            <Icon name="location-on" size={18} color={colors.tertiary} />
          </View>
          <Text style={styles.section}>Address</Text>
        </View>
        <Input label="Address Line 1" value={form.address_line1 || ''} onChangeText={set('address_line1')} editable={canEdit} />
        <Input label="Address Line 2" value={form.address_line2 || ''} onChangeText={set('address_line2')} editable={canEdit} />
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input label="City" value={form.city || ''} onChangeText={set('city')} editable={canEdit} />
          </View>
          <View style={styles.flex1}>
            <Input label="State" value={form.state || ''} onChangeText={set('state')} editable={canEdit} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input label="Country" value={form.country || ''} onChangeText={set('country')} editable={canEdit} />
          </View>
          <View style={styles.flex1}>
            <Input label="Postal Code" value={form.postal_code || ''} onChangeText={set('postal_code')} editable={canEdit} />
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconWrap, { backgroundColor: `${colors.success}1A` }]}>
            <Icon name="public" size={18} color={colors.success} />
          </View>
          <Text style={styles.section}>Online Presence</Text>
        </View>
        <Input
          label="Website"
          placeholder="https://..."
          autoCapitalize="none"
          keyboardType="url"
          value={form.website || ''}
          onChangeText={set('website')}
          editable={canEdit}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {canEdit && <PrimaryButton title="Save Changes" onPress={save} loading={saving} style={styles.submit} />}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loader: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.DEFAULT,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
