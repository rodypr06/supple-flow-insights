// Local storage database implementation for browser environment
// This provides a simple JSON-based database that mimics the SQLite interface

import { v4 as uuidv4 } from 'uuid';

// Re-export types from database.ts
export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  dosage_unit: string;
  recommended_dosage: number;
  max_dosage?: number;
  capsule_mg?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Intake {
  id: string;
  supplement_id: string;
  user_id: string;
  dosage: number;
  taken_at: string;
  notes?: string;
  created_at: string;
}

export interface IntakeWithSupplement extends Intake {
  supplements: Supplement;
}

interface DatabaseData {
  profiles: Profile[];
  supplements: Supplement[];
  intakes: Intake[];
}

class LocalStorageDB {
  private static readonly STORAGE_KEY = 'suppleflow_db';

  private getData(): DatabaseData {
    const data = localStorage.getItem(LocalStorageDB.STORAGE_KEY);
    if (!data) {
      const initialData: DatabaseData = {
        profiles: [],
        supplements: [],
        intakes: []
      };
      this.saveData(initialData);
      return initialData;
    }
    return JSON.parse(data);
  }

  private saveData(data: DatabaseData): void {
    localStorage.setItem(LocalStorageDB.STORAGE_KEY, JSON.stringify(data));
  }

  // Profile operations
  getProfiles(): Profile[] {
    const data = this.getData();
    return data.profiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getProfile(id: string): Profile | undefined {
    const data = this.getData();
    return data.profiles.find(p => p.id === id);
  }

  createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Profile {
    const data = this.getData();
    const now = new Date().toISOString();
    const newProfile: Profile = {
      ...profile,
      created_at: now,
      updated_at: now
    };
    data.profiles.push(newProfile);
    this.saveData(data);
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<Pick<Profile, 'username'>>): Profile | undefined {
    const data = this.getData();
    const profileIndex = data.profiles.findIndex(p => p.id === id);
    if (profileIndex === -1) return undefined;

    const now = new Date().toISOString();
    data.profiles[profileIndex] = {
      ...data.profiles[profileIndex],
      ...updates,
      updated_at: now
    };
    this.saveData(data);
    return data.profiles[profileIndex];
  }

  // Supplement operations
  getSupplements(userId: string): Supplement[] {
    const data = this.getData();
    return data.supplements
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getSupplement(id: string): Supplement | undefined {
    const data = this.getData();
    return data.supplements.find(s => s.id === id);
  }

  createSupplement(supplement: Omit<Supplement, 'created_at' | 'updated_at'>): Supplement {
    const data = this.getData();
    const now = new Date().toISOString();
    const newSupplement: Supplement = {
      ...supplement,
      created_at: now,
      updated_at: now
    };
    data.supplements.push(newSupplement);
    this.saveData(data);
    return newSupplement;
  }

  updateSupplement(id: string, updates: Partial<Omit<Supplement, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Supplement | undefined {
    const data = this.getData();
    const supplementIndex = data.supplements.findIndex(s => s.id === id);
    if (supplementIndex === -1) return undefined;

    const now = new Date().toISOString();
    data.supplements[supplementIndex] = {
      ...data.supplements[supplementIndex],
      ...updates,
      updated_at: now
    };
    this.saveData(data);
    return data.supplements[supplementIndex];
  }

  deleteSupplement(id: string): boolean {
    const data = this.getData();
    const initialLength = data.supplements.length;
    data.supplements = data.supplements.filter(s => s.id !== id);
    // Also delete related intakes
    data.intakes = data.intakes.filter(i => i.supplement_id !== id);
    this.saveData(data);
    return data.supplements.length < initialLength;
  }

  // Intake operations
  getIntakes(userId: string, filters?: { 
    startDate?: string; 
    endDate?: string; 
    supplementId?: string; 
  }): IntakeWithSupplement[] {
    const data = this.getData();
    let filteredIntakes = data.intakes.filter(i => i.user_id === userId);

    if (filters?.startDate) {
      filteredIntakes = filteredIntakes.filter(i => i.taken_at >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredIntakes = filteredIntakes.filter(i => i.taken_at <= filters.endDate!);
    }

    if (filters?.supplementId) {
      filteredIntakes = filteredIntakes.filter(i => i.supplement_id === filters.supplementId!);
    }

    // Join with supplements
    const intakesWithSupplements: IntakeWithSupplement[] = filteredIntakes
      .map(intake => {
        const supplement = data.supplements.find(s => s.id === intake.supplement_id);
        if (!supplement) return null;
        return {
          ...intake,
          supplements: supplement
        };
      })
      .filter(Boolean) as IntakeWithSupplement[];

    return intakesWithSupplements.sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime());
  }

  createIntake(intake: Omit<Intake, 'created_at'>): Intake {
    const data = this.getData();
    const now = new Date().toISOString();
    const newIntake: Intake = {
      ...intake,
      created_at: now
    };
    data.intakes.push(newIntake);
    this.saveData(data);
    return newIntake;
  }

  deleteIntake(id: string): boolean {
    const data = this.getData();
    const initialLength = data.intakes.length;
    data.intakes = data.intakes.filter(i => i.id !== id);
    this.saveData(data);
    return data.intakes.length < initialLength;
  }

  // Utility methods
  exportData(): DatabaseData {
    return this.getData();
  }

  importData(data: DatabaseData): void {
    this.saveData(data);
  }

  clearAll(): void {
    localStorage.removeItem(LocalStorageDB.STORAGE_KEY);
  }
}

// Create singleton instance
let dbInstance: LocalStorageDB | null = null;

export function getDatabase(): LocalStorageDB {
  if (!dbInstance) {
    dbInstance = new LocalStorageDB();
  }
  return dbInstance;
}