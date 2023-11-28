// @ts-nocheck
import { writable } from "svelte/store";
import { ID } from "appwrite";
import { goto } from "$app/navigation";
import { account } from "$lib/appwrite";

const isBrowser = typeof window !== 'undefined';

const createUser = () => {
	const store = writable(null);

	async function init() {
    if (!isBrowser) return;
		try {
			store.set(await account.get());
		} catch (e) {
			store.set(null);
		}
	}

	init();

  async function register(name, email, password) {
    if (!isBrowser) return;
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  }

  async function login(email, password) {
    if (!isBrowser) return;
    await account.createEmailSession(email, password);
    await init();
    goto('/app');
  }

  async function loginAnonymous() {
    if (!isBrowser) return;
    await account.createAnonymousSession()
    await init();
    goto('/app');
  }

  async function logout() {
    if (!isBrowser) return;
    await account.deleteSession('current');
    store.set(null);
    goto('/');
  }

  async function createRecovery(email) {
    if (!isBrowser) return;
    await account.createRecovery(email, import.meta.env.VITE_APP_URL + '/auth/reset/complete');
    alert('Check your email for a recovery link');
    goto('/');
  }

  async function updateRecovery(userId, secret, password, confirmPassword) {
    if (!isBrowser) return;
    await account.updateRecovery(userId, secret, password, confirmPassword);
    goto('/auth/login');
  }

  async function updatePassword(oldPassword, newPassword) {
    if (!isBrowser) return;
    await account.updatePassword(newPassword, oldPassword);
  }

  return {
    subscribe: store.subscribe, 
    register,
    login,
    loginAnonymous,
    logout,
    init,
    createRecovery,
    updateRecovery,
    updatePassword
  }
}

export const user = createUser();
