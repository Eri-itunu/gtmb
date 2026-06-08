import * as SecureStore from "expo-secure-store";

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const secureStorage = {
  getString: (key: string) => SecureStore.getItemAsync(key, SECURE_STORE_OPTIONS),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS),
  remove: (key: string) => SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS),
};
