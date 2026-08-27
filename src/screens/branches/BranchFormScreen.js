import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import Icon from '../../components/common/Icon';
import { createBranch, updateBranch } from '../../api/branches';
import { ApiError } from '../../api/client';
import { useAlert } from '../../context/AlertContext';

export default function BranchFormScreen({ navigation, route }) {
  const { showAlert } = useAlert();
  const editingBranch = route.params?.branch || null;
  const isEdit = !!editingBranch;

  const [form, setForm] = useState({
    name: editingBranch?.name || '',
    code: editingBranch?.code || '',
    email: editingBranch?.email || '',
    phone: editingBranch?.phone || '',
    admin_email: '',
    admin_password: '',
    admin_full_name: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = key => value => setForm(f => ({ ...f, [key]: value }));

  const submit = async () => {
    setError(null);
    if (isEdit) {
      if (!form.name.trim()) {
        setError('Branch name is required.');
        return;
      }
      setSaving(true);
      try {
        await updateBranch(editingBranch.id, {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
        });
        navigation.goBack();
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Failed to update branch');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!form.name.trim() || !form.code.trim() || !form.email.trim() || !form.admin_email.trim() || form.admin_password.length < 8) {
      setError('Name, code, email, admin email are required and the admin password needs 8+ characters.');
      return;
    }
    setSaving(true);
    try {
      await createBranch({
        name: form.name.trim(),
        code: form.code.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        admin_email: form.admin_email.trim(),
        admin_password: form.admin_password,
        admin_full_name: form.admin_full_name.trim() || undefined,
      });
      showAlert('Branch created', `${form.name} was created successfully.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create branch');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={isEdit ? 'Edit Branch' : 'Add Branch'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Icon name="storefront" size={18} color={colors.primary} />
          </View>
          <Text style={styles.section}>Branch Details</Text>
        </View>
        <Input label="Branch Name" placeholder="e.g. North Campus" value={form.name} onChangeText={set('name')} />
        <Input
          label="Branch Code"
          placeholder="e.g. NORTH01"
          autoCapitalize="characters"
          value={form.code}
          onChangeText={set('code')}
          editable={!isEdit}
        />
        <Input label="Email" placeholder="branch@institute.edu" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={set('email')} />
        <Input label="Phone (optional)" placeholder="+1 555 123 4567" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />

        {!isEdit && (
          <>
            <View style={styles.divider} />
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: `${colors.secondary}1A` }]}>
                <Icon name="admin-panel-settings" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.section}>First Branch Admin</Text>
            </View>
            <Input label="Admin Full Name (optional)" placeholder="e.g. Sarah Jenkins" value={form.admin_full_name} onChangeText={set('admin_full_name')} />
            <Input label="Admin Email" placeholder="admin@institute.edu" autoCapitalize="none" keyboardType="email-address" value={form.admin_email} onChangeText={set('admin_email')} />
            <Input label="Admin Password" placeholder="Min 8 characters" secureTextEntry value={form.admin_password} onChangeText={set('admin_password')} />
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton title={isEdit ? 'Save Changes' : 'Create Branch'} onPress={submit} loading={saving} style={styles.submit} />
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
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
