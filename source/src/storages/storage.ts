import { IAgentStorage } from '@extrimian/agent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage implements IAgentStorage {
    private id: string;

    constructor(id = 'dummyId') {
        this.id = id;
    }

    async add(key: string, data: any): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
            try {
                let storage = await AsyncStorage.getItem(this.id);
                if (storage?.length) {
                    await AsyncStorage.setItem(this.id, JSON.stringify([...JSON.parse(storage), key]));
                } else {
                    await AsyncStorage.setItem(this.id, JSON.stringify([key]));
                }
            } catch (error) {}
        } catch (error) {
            throw error;
        }
    }

    async get(key: string): Promise<any> {
        const value = await AsyncStorage.getItem(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }

    async getAll(): Promise<Map<string, any>> {
        const map = new Map<string, any>();
        try {
            const storage = JSON.parse(await AsyncStorage.getItem(this.id));
            for (const key of storage) {
                map.set(key, JSON.parse(await AsyncStorage.getItem(key)));
            }
            return map;
        } catch (error) {
            return map;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
            const storage = JSON.parse(await AsyncStorage.getItem(this.id));
            await AsyncStorage.setItem(this.id, JSON.stringify(storage.filter((k: string) => k !== key)));
        } catch (error) {
            throw error;
        }
    }

    async update(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            throw error;
        }
    }

    async clear(): Promise<void> {
        await AsyncStorage.clear();
    }
}
