import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 30,
    borderRadius: 20,
  },
  skyImage: {
    width: 280,
    height: 280,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  getStarted: {
    marginTop: 40,
    backgroundColor: '#f089d9ff',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  smallLink: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
});
