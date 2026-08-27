import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, radius, spacing, typography } from '../../constants';
import Icon from '../../components/common/Icon';
import Input from '../../components/forms/Input';
import Dropdown from '../../components/forms/Dropdown';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import { createCourse, updateCourse } from '../../api/courses';
import { listCourseCategories } from '../../api/courseCategories';
import { ApiError } from '../../api/client';

const DURATION_UNIT_OPTIONS = [
  { label: 'Hours', value: 'HOURS' },
  { label: 'Days', value: 'DAYS' },
  { label: 'Weeks', value: 'WEEKS' },
  { label: 'Months', value: 'MONTHS' },
];

function Section({ icon, title, hint, children, first, last }) {
  return (
    <View style={[styles.section, first && styles.sectionFirst, last && styles.sectionLast]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Icon name={icon} size={15} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>
          {title}
          {!!hint && <Text style={styles.sectionHint}> {hint}</Text>}
        </Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function CourseFormScreen({ navigation, route }) {
  const editingCourse = route.params?.course || null;
  const isEdit = !!editingCourse;
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(editingCourse?.name || '');
  const [code, setCode] = useState(editingCourse?.code || '');
  const [description, setDescription] = useState(editingCourse?.description || '');
  const [durationValue, setDurationValue] = useState(editingCourse?.duration_value ? String(editingCourse.duration_value) : '');
  const [durationUnit, setDurationUnit] = useState(editingCourse?.duration_unit || 'WEEKS');
  const [price, setPrice] = useState(editingCourse?.price ? String(editingCourse.price) : '');
  const [thumbnail, setThumbnail] = useState(null);
  const [selfEnrollmentEnabled, setSelfEnrollmentEnabled] = useState(editingCourse?.self_enrollment_enabled ?? false);
  const [categoryId, setCategoryId] = useState(editingCourse?.category_id ?? null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const thumbnailPreviewUri = thumbnail?.uri || editingCourse?.thumbnail_url || null;

  useEffect(() => {
    const loadCategories = () => listCourseCategories().then(({ data }) => setCategories(data)).catch(() => {});
    loadCategories();
    const unsub = navigation.addListener('focus', loadCategories);
    return unsub;
  }, [navigation]);

  const pickThumbnail = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (result.didCancel || !result.assets?.length) return;
    setThumbnail(result.assets[0]);
  };

  const openCategoryManager = () => {
    navigation.navigate('CourseCategories', {
      onPick: cat => {
        setCategoryId(cat.id);
        setCategories(prev => (prev.some(c => c.id === cat.id) ? prev : [...prev, cat]));
      },
    });
  };

  const submit = async () => {
    setError(null);
    if (!name.trim() || !code.trim() || !categoryId) {
      setError('Name, code, and category are required.');
      return;
    }
    setSaving(true);
    try {
      const fields = {
        category_id: categoryId,
        name: name.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        duration_value: durationValue ? Number(durationValue) : undefined,
        duration_unit: durationValue ? durationUnit : undefined,
        price: price.trim() || undefined,
        self_enrollment_enabled: selfEnrollmentEnabled,
      };
      if (isEdit) {
        await updateCourse(editingCourse.id, fields, thumbnail);
      } else {
        await createCourse(fields, thumbnail);
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `Failed to ${isEdit ? 'update' : 'create'} course`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            {thumbnailPreviewUri ? (
              <Image source={{ uri: thumbnailPreviewUri }} style={styles.heroImage} />
            ) : (
              <View style={[styles.heroImage, styles.heroPlaceholder]}>
                <Icon name="add-photo-alternate" size={32} color={colors.primary} />
                <Text style={styles.heroPlaceholderText}>Add a cover image</Text>
              </View>
            )}
            <View style={styles.heroScrim} />

            <Pressable
              style={[styles.heroBtn, styles.heroBack, { top: insets.top + spacing.sm }]}
              onPress={() => navigation.goBack()}
              hitSlop={8}
            >
              <Icon name="arrow-back" size={20} color={colors.onSurface} />
            </Pressable>

            <Pressable
              style={[styles.heroBtn, styles.heroCamera, { top: insets.top + spacing.sm }]}
              onPress={pickThumbnail}
              hitSlop={8}
            >
              <Icon name="photo-camera" size={18} color={colors.onSurface} />
            </Pressable>

            <View style={styles.heroLabel}>
              <Text style={styles.heroLabelText}>{isEdit ? 'Edit Course' : 'New Course'}</Text>
            </View>
          </View>

          <View style={styles.sheet}>
            <Section icon="menu-book" title="Basics" first>
              <Input label="Course Name" placeholder="e.g. FastAPI Bootcamp" value={name} onChangeText={setName} />
              <Input label="Course Code" placeholder="e.g. FAPI-101" autoCapitalize="characters" value={code} onChangeText={setCode} />
              <Input
                label="Description (optional)"
                placeholder="What will students learn?"
                value={description}
                onChangeText={setDescription}
              />
            </Section>

            <Section icon="category" title="Classification">
              <Dropdown
                label="Category"
                icon="school"
                placeholder="Select a category"
                value={categoryId}
                options={categories.map(c => ({ label: c.name, value: c.id }))}
                onChange={setCategoryId}
                action={{ icon: 'add', label: 'Manage categories', onPress: openCategoryManager }}
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="Duration (optional)"
                    placeholder="e.g. 6"
                    keyboardType="numeric"
                    value={durationValue}
                    onChangeText={setDurationValue}
                  />
                </View>
                <View style={styles.flex1}>
                  <Dropdown label="Unit" value={durationUnit} options={DURATION_UNIT_OPTIONS} onChange={setDurationUnit} />
                </View>
              </View>
            </Section>

            <Section icon="payments" title="Pricing" hint="(optional)">
              <View style={styles.priceRow}>
                <Text style={styles.rupee}>₹</Text>
                <Input
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                  containerStyle={styles.priceField}
                />
              </View>
            </Section>

            <Section icon="tune" title="Enrollment" last>
              <Pressable style={styles.toggleRow} onPress={() => setSelfEnrollmentEnabled(v => !v)}>
                <View style={styles.flex1}>
                  <Text style={styles.toggleTitle}>Self-enrollment</Text>
                  <Text style={styles.toggleSub}>Allow students to enroll in this course themselves</Text>
                </View>
                <Icon
                  name={selfEnrollmentEnabled ? 'toggle-on' : 'toggle-off'}
                  size={36}
                  color={selfEnrollmentEnabled ? colors.primary : colors.outline}
                />
              </Pressable>
            </Section>

            {!!error && (
              <View style={styles.errorBanner}>
                <Icon name="error-outline" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
          <SecondaryButton title="Cancel" onPress={() => navigation.goBack()} disabled={saving} style={styles.cancelBtn} />
          <PrimaryButton
            title={isEdit ? 'Save Changes' : 'Create Course'}
            onPress={submit}
            loading={saving}
            style={styles.saveBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  hero: {
    height: 280,
    width: '100%',
    backgroundColor: colors.surfaceContainerHigh,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  heroPlaceholderText: {
    ...typography.labelMd,
    fontWeight: '600',
    color: colors.primary,
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: 'rgba(25,27,35,0.22)',
  },
  heroBtn: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBack: {
    left: spacing.md,
  },
  heroCamera: {
    right: spacing.md,
  },
  heroLabel: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: 'rgba(25,27,35,0.55)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroLabelText: {
    ...typography.labelMd,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sheet: {
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    gap: spacing.md,
  },
  sectionFirst: {
    paddingTop: spacing.xl,
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,74,198,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.labelMd,
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionHint: {
    ...typography.labelMd,
    fontWeight: '500',
    color: colors.outline,
    textTransform: 'none',
  },
  sectionBody: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rupee: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurfaceVariant,
  },
  priceField: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  toggleSub: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.onErrorContainer,
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.4,
  },
});
