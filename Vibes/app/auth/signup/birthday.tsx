import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { signupStyles as s } from '@/styles/signup'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useRouter } from 'expo-router'
import { useSignup } from '@/contexts/SignupContext'
import { validateBirthday } from '@/lib/validation'
import WheelPicker from 'react-native-wheel-picker-expo'
import WheelPickerExpo from 'react-native-wheel-picker-expo'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

export default function Birthday() {
  const router = useRouter();
  const { signupData, updateSignupData } = useSignup();

  // Default to June 15, 2006 (as shown in design)
  const defaultMonth = signupData.birthday?.month || 6;
  const defaultDay = signupData.birthday?.day || 15;
  const defaultYear = signupData.birthday?.year || 2006;

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth - 1); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(defaultDay - 1); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(YEARS.indexOf(defaultYear));
  const [error, setError] = useState<string | undefined>();

  const month = selectedMonth + 1;
  const day = selectedDay + 1;
  const year = YEARS[selectedYear];

  useEffect(() => {
    // Validate when selections change
    const validation = validateBirthday(month, day, year);
    if (!validation.isValid && validation.error) {
      setError(validation.error);
    } else {
      setError(undefined);
    }
  }, [month, day, year]);

  const handleContinue = async () => {
    const validation = validateBirthday(month, day, year);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    updateSignupData({
      birthday: { month, day, year },
    });

    router.push("/auth/signup/verification");
  };

  return (
    <View style={s.screen}>
      <View style={[s.container, { backgroundColor: '#f9e7f6ff' }]}>
        <View style={s.content}>
          <ProgressIndicator total={4} current={2} />
          <Text style={s.title}>When is your birthday?</Text>
          <Text style={s.subtitle}>Your birthday won't be shown publicly.</Text>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <WheelPickerExpo
                initialSelectedIndex={selectedMonth}
                onChange={({ index }) => setSelectedMonth(index)}
                items={MONTHS.map(m => ({ label: m, value: m }))}
                height={200}
                backgroundColor="#f7e8f3"
              />
            </View>

            <View style={styles.pickerWrapper}>
              <WheelPickerExpo
                initialSelectedIndex={selectedDay}
                onChange={({ index }) => setSelectedDay(index)}
                items={DAYS.map(d => ({ label: d.toString(), value: d }))}
                height={200}
                backgroundColor="#f7e8f3"
              />
            </View>

            <View style={styles.pickerWrapper}>
              <WheelPickerExpo
                initialSelectedIndex={selectedYear}
                onChange={({ index }) => setSelectedYear(index)}
                items={YEARS.map(y => ({ label: y.toString(), value: y }))}
                height={200}
                backgroundColor="#f7e8f3"
              />
            </View>

          </View>

          {error && <Text style={s.errorText}>{error}</Text>}

          <Pressable
            onPress={handleContinue}
            style={s.button}
          >
            <LinearGradient
              colors={['#FFB6D9', '#FF9EC5']}
              style={s.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={s.buttonText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 40,
    height: 200,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pickerWrapperStyle: {
    width: '100%',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#999',
  },
  pickerSelectedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    backgroundColor: 'rgba(154, 137, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
})