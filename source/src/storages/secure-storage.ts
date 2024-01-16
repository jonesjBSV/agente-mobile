import { AgentSecureStorage } from '@extrimian/agent';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
const secureStore = createSecureStore();

export class SecureStorage implements AgentSecureStorage {
    private id: string;

    constructor(id = 'dummyId') {
        this.id = id;
    }

    async add(key: string, data: string): Promise<void> {
        try {
            let storageKeys = await this.getSecureKeys();
            await secureStore.setItem(key, JSON.stringify(data));
            await secureStore.setItem(this.id, JSON.stringify([...storageKeys.filter((element) => element !== key), key]));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async getSecureKeys(): Promise<any[]> {
        try {
            const storageKeys = JSON.parse(await secureStore.getItem(this.id));
            return storageKeys || [];
        } catch (error) {
            await secureStore.setItem(this.id, JSON.stringify([]));
            return [];
        }
    }

    async get(key: string): Promise<string> {
        try {
            const value = JSON.parse(await secureStore.getItem(key));
            if (!value) {
                return null;
            }
            return value;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll(): Promise<Map<string, any>> {
        const map = new Map<string, any>();
        try {
            const storageKeys = await this.getSecureKeys();
            for (const key of storageKeys) {
                map.set(key, JSON.parse(await secureStore.getItem(key)));
            }
            return map;
        } catch (error) {
            return map;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await secureStore.removeItem(key);
            const storageKeys = await this.getSecureKeys();
            if (!storageKeys.length) {
                return;
            }
            await secureStore.setItem(this.id, JSON.stringify(storageKeys.filter((k: string) => k !== key)));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(key: string, data: any) {
        try {
            await secureStore.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async clear() {
        try {
            const storageKeys = await this.getSecureKeys();
            if (storageKeys.length > 0) {
                for (const key of storageKeys) {
                    await secureStore.removeItem(key);
                }
            }
            await secureStore.removeItem(this.id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
