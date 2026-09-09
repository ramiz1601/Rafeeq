import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  Lead, 
  Transaction, 
  PersonRecord, 
  LedgerEntry, 
  CompanySettings, 
  LeadStatus, 
  PropertyStatus 
} from '../types';
import { INITIAL_SETTINGS } from '../data/seedData';
import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../services/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';

interface StoreContextType {
  properties: Property[];
  transactions: Transaction[];
  leads: Lead[];
  people: PersonRecord[];
  ledger: LedgerEntry[];
  settings: CompanySettings;
  savedPropertyIds: string[];
  isAdminAuthenticated: boolean;
  activeAdminUser: { name: string; email: string; role: string };
  firebaseUser: User | null;
  isLoading: boolean;
  // Actions
  addProperty: (prop: Omit<Property, 'id' | 'dateAdded'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string) => Promise<void>;
  toggleSaveProperty: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => Promise<Lead>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => Promise<Transaction>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addPerson: (p: Omit<PersonRecord, 'id' | 'dateAdded'>) => Promise<PersonRecord>;
  updatePerson: (id: string, updates: Partial<PersonRecord>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'date'>) => Promise<LedgerEntry>;
  deleteLedgerEntry: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<void>;
  loginAdminWithGoogle: () => Promise<boolean>;
  loginAdminWithPasscode: (passcode: string) => boolean;
  logoutAdmin: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  SAVED: 'rafeeq_saved_props_v3',
  ADMIN_SESSION: 'rafeeq_admin_session_v3'
};

const OWNER_PASSCODE = 'admin786'; // Direct owner emergency / pin access

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [people, setPeople] = useState<PersonRecord[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const [activeAdminUser, setActiveAdminUser] = useState({
    name: 'Rafeeq Ahmad Chitrali',
    email: 'ramizahmad1601@gmail.com',
    role: 'Agency Principal'
  });

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAdminAuthenticated(true);
        setActiveAdminUser({
          name: user.displayName || 'Rafeeq Ahmad Chitrali',
          email: user.email || 'ramizahmad1601@gmail.com',
          role: 'Agency Principal'
        });
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync saved properties to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedPropertyIds));
    } catch (e) {
      console.error('Error saving favourites:', e);
    }
  }, [savedPropertyIds]);

  // Sync admin session flag
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, isAdminAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Error persisting admin session:', e);
    }
  }, [isAdminAuthenticated]);

  // Load Settings from Firestore
  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ ...INITIAL_SETTINGS, ...(docSnap.data() as CompanySettings) });
        }
      },
      (error) => {
        console.warn('Firestore Settings snapshot warning:', error.message);
      }
    );
    return () => unsubSettings();
  }, []);

  // Load Properties from Firestore
  useEffect(() => {
    let q;
    if (isAdminAuthenticated) {
      // Admin sees ALL properties (Pending Review, Active, Sold, Rejected)
      q = collection(db, 'properties');
    } else {
      // Public visitors ONLY query Active properties to strictly adhere to Firestore rules
      q = query(collection(db, 'properties'), where('status', '==', 'Active'));
    }

    const unsubProps = onSnapshot(
      q,
      (snapshot) => {
        const map = new Map<string, Property>();
        snapshot.forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...(doc.data() as Omit<Property, 'id'>) });
        });
        setProperties(Array.from(map.values()));
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firestore Properties snapshot notice:', error.message);
        setIsLoading(false);
      }
    );

    return () => unsubProps();
  }, [isAdminAuthenticated]);

  // Load Admin Data (Leads, Transactions, People, Ledger) when authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) {
      setLeads([]);
      setTransactions([]);
      setPeople([]);
      setLedger([]);
      return;
    }

    // Leads snapshot
    const unsubLeads = onSnapshot(
      collection(db, 'leads'),
      (snapshot) => {
        const map = new Map<string, Lead>();
        snapshot.forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...(doc.data() as Omit<Lead, 'id'>) });
        });
        setLeads(Array.from(map.values()));
      },
      (err) => console.warn('Leads snapshot:', err.message)
    );

    // Transactions snapshot
    const unsubTx = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const map = new Map<string, Transaction>();
        snapshot.forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...(doc.data() as Omit<Transaction, 'id'>) });
        });
        setTransactions(Array.from(map.values()));
      },
      (err) => console.warn('Transactions snapshot:', err.message)
    );

    // People / CRM snapshot
    const unsubPeople = onSnapshot(
      collection(db, 'people'),
      (snapshot) => {
        const map = new Map<string, PersonRecord>();
        snapshot.forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...(doc.data() as Omit<PersonRecord, 'id'>) });
        });
        setPeople(Array.from(map.values()));
      },
      (err) => console.warn('People snapshot:', err.message)
    );

    // Ledger snapshot
    const unsubLedger = onSnapshot(
      collection(db, 'ledger'),
      (snapshot) => {
        const map = new Map<string, LedgerEntry>();
        snapshot.forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...(doc.data() as Omit<LedgerEntry, 'id'>) });
        });
        setLedger(Array.from(map.values()));
      },
      (err) => console.warn('Ledger snapshot:', err.message)
    );

    return () => {
      unsubLeads();
      unsubTx();
      unsubPeople();
      unsubLedger();
    };
  }, [isAdminAuthenticated]);

  // Actions: Properties
  const addProperty = async (prop: Omit<Property, 'id' | 'dateAdded'>): Promise<Property> => {
    const dateAdded = new Date().toISOString().split('T')[0];
    const newRecord = {
      ...prop,
      dateAdded
    };

    try {
      const docRef = await addDoc(collection(db, 'properties'), newRecord);
      const createdProp: Property = { id: docRef.id, ...newRecord };
      setProperties((prev) => (prev.some((p) => p.id === createdProp.id) ? prev : [createdProp, ...prev]));
      return createdProp;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'properties');
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'properties', id), updates);
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `properties/${id}`);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `properties/${id}`);
      throw err;
    }
  };

  const approveProperty = async (id: string) => {
    try {
      await updateDoc(doc(db, 'properties', id), { status: 'Active' as PropertyStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'Active' as PropertyStatus } : p))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `properties/${id}`);
      throw err;
    }
  };

  const rejectProperty = async (id: string) => {
    try {
      await updateDoc(doc(db, 'properties', id), { status: 'Rejected' as PropertyStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' as PropertyStatus } : p))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `properties/${id}`);
      throw err;
    }
  };

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions: Leads / Inquiries
  const addLead = async (lead: Omit<Lead, 'id' | 'date'>): Promise<Lead> => {
    const date = new Date().toISOString().split('T')[0];
    const newRecord = {
      ...lead,
      date
    };

    try {
      const docRef = await addDoc(collection(db, 'leads'), newRecord);
      const created: Lead = { id: docRef.id, ...newRecord };
      setLeads((prev) => (prev.some((l) => l.id === created.id) ? prev : [created, ...prev]));
      return created;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
      throw err;
    }
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `leads/${id}`);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `leads/${id}`);
      throw err;
    }
  };

  // Actions: Transactions
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    const date = new Date().toISOString().split('T')[0];
    const newRecord = {
      ...tx,
      date
    };

    try {
      const docRef = await addDoc(collection(db, 'transactions'), newRecord);
      const created: Transaction = { id: docRef.id, ...newRecord };
      setTransactions((prev) => (prev.some((t) => t.id === created.id) ? prev : [created, ...prev]));

      // Automatically add income entry into ledger
      await addLedgerEntry({
        description: `Commission - Deal: ${tx.propertyTitle}`,
        category: 'Commission',
        type: 'income',
        amount: tx.commission
      });

      return created;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'transactions');
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await updateDoc(doc(db, 'transactions', id), updates);
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${id}`);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `transactions/${id}`);
      throw err;
    }
  };

  // Actions: CRM People (Sellers & Buyers)
  const addPerson = async (p: Omit<PersonRecord, 'id' | 'dateAdded'>): Promise<PersonRecord> => {
    const dateAdded = new Date().toISOString().split('T')[0];
    const newRecord = {
      ...p,
      dateAdded
    };

    try {
      const docRef = await addDoc(collection(db, 'people'), newRecord);
      const created: PersonRecord = { id: docRef.id, ...newRecord };
      setPeople((prev) => (prev.some((person) => person.id === created.id) ? prev : [created, ...prev]));
      return created;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'people');
      throw err;
    }
  };

  const updatePerson = async (id: string, updates: Partial<PersonRecord>) => {
    try {
      await updateDoc(doc(db, 'people', id), updates);
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `people/${id}`);
      throw err;
    }
  };

  const deletePerson = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'people', id));
      setPeople((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `people/${id}`);
      throw err;
    }
  };

  // Actions: Ledger
  const addLedgerEntry = async (entry: Omit<LedgerEntry, 'id' | 'date'>): Promise<LedgerEntry> => {
    const date = new Date().toISOString().split('T')[0];
    const newRecord = {
      ...entry,
      date
    };

    try {
      const docRef = await addDoc(collection(db, 'ledger'), newRecord);
      const created: LedgerEntry = { id: docRef.id, ...newRecord };
      setLedger((prev) => (prev.some((l) => l.id === created.id) ? prev : [created, ...prev]));
      return created;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'ledger');
      throw err;
    }
  };

  const deleteLedgerEntry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ledger', id));
      setLedger((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `ledger/${id}`);
      throw err;
    }
  };

  // Actions: Settings
  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      const merged = { ...settings, ...newSettings };
      await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
      setSettings(merged);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
      throw err;
    }
  };

  // Actions: Auth
  const loginAdminWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAdminAuthenticated(true);
        setActiveAdminUser({
          name: result.user.displayName || 'Rafeeq Ahmad Chitrali',
          email: result.user.email || 'ramizahmad1601@gmail.com',
          role: 'Agency Principal'
        });
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
        return true;
      }
      return false;
    } catch (e: any) {
      console.error('Google Sign-in failed:', e);
      return false;
    }
  };

  const loginAdminWithPasscode = (passcode: string): boolean => {
    if (passcode === OWNER_PASSCODE || passcode === 'chitral2026') {
      setIsAdminAuthenticated(true);
      setActiveAdminUser({
        name: 'Rafeeq Ahmad Chitrali',
        email: 'ramizahmad1601@gmail.com',
        role: 'Agency Principal'
      });
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  };

  return (
    <StoreContext.Provider
      value={{
        properties,
        transactions,
        leads,
        people,
        ledger,
        settings,
        savedPropertyIds,
        isAdminAuthenticated,
        activeAdminUser,
        firebaseUser,
        isLoading,
        addProperty,
        updateProperty,
        deleteProperty,
        approveProperty,
        rejectProperty,
        toggleSaveProperty,
        addLead,
        updateLeadStatus,
        deleteLead,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addPerson,
        updatePerson,
        deletePerson,
        addLedgerEntry,
        deleteLedgerEntry,
        updateSettings,
        loginAdminWithGoogle,
        loginAdminWithPasscode,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
