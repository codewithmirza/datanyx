// Mock Firebase implementation
// This replaces the real Firebase implementation to work without API keys

// Mock User type to match Firebase User
class MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  
  constructor(email: string) {
    this.uid = Math.random().toString(36).substring(2, 15);
    this.email = email;
    this.displayName = email.split('@')[0];
  }
}

// Mock Auth service
class MockAuth {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  constructor() {
    // Pre-populate with test user if needed
    // this.currentUser = new MockUser('test@example.com');
  }

  // Match Firebase's onAuthStateChanged API
  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // Immediately call with current user
    setTimeout(() => callback(this.currentUser), 0);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Match Firebase's signInWithEmailAndPassword API
  async signInWithEmailAndPassword(email: string, password: string) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create a mock user
    this.currentUser = new MockUser(email);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentUser));
    
    return { user: this.currentUser };
  }

  // Match Firebase's createUserWithEmailAndPassword API
  async createUserWithEmailAndPassword(email: string, password: string) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create a mock user
    this.currentUser = new MockUser(email);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentUser));
    
    return { user: this.currentUser };
  }

  // Match Firebase's signOut API
  async signOut() {
    this.currentUser = null;
    
    // Notify listeners
    this.listeners.forEach(listener => listener(null));
  }
}

// Mock document data
const mockData = {
  users: {
    'test-user-id': {
      name: 'Test User',
      email: 'test@example.com',
      university: 'Test University',
      loanAmount: 50000,
      interestRate: 4.5,
      repaymentTerm: 120,
      monthlyIncome: 3000,
      monthlyExpenses: 2000,
      country: 'USA',
    }
  },
  loans: [
    { loanAmount: 40000, defaultStatus: 0 },
    { loanAmount: 60000, defaultStatus: 1 },
    { loanAmount: 35000, defaultStatus: 0 },
  ],
  risks: [
    { creditScore: 650, riskLevel: 'medium' },
    { creditScore: 750, riskLevel: 'low' },
    { creditScore: 550, riskLevel: 'high' },
  ],
  inclusion: {
    'gender-gap': { score: 0.82 },
    'income-diversity': { score: 0.65 },
    'regional-coverage': { score: 0.91 },
  }
};

// Mock Firestore document
class MockDocumentSnapshot {
  // Make these public so they can be accessed
  public _data: any;
  public _exists: boolean;
  public id: string;

  constructor(data: any, id: string = 'mock-id') {
    this._data = data;
    this._exists = !!data;
    this.id = id;
  }

  exists() {
    return this._exists;
  }

  data() {
    return this._data;
  }
}

// Mock Firestore collection query snapshot
class MockQuerySnapshot {
  docs: MockDocumentSnapshot[];

  constructor(docs: any[]) {
    this.docs = docs.map((doc, index) => {
      // If doc is already a MockDocumentSnapshot, return it
      if (doc instanceof MockDocumentSnapshot) return doc;
      
      // For documents with explicit id
      if (doc.id) {
        return new MockDocumentSnapshot(doc, doc.id);
      }
      
      // For plain objects from arrays
      return new MockDocumentSnapshot(doc, `mock-id-${index}`);
    });
  }
}

// Mock Firestore
class MockFirestore {
  // Mock document reference
  doc(collectionPath: string, documentId: string) {
    return {
      // Use path to determine which data to return
      collection: collectionPath,
      id: documentId,
    };
  }

  // Mock collection reference
  collection(collectionPath: string) {
    const collectionData = mockData[collectionPath as keyof typeof mockData];
    
    // Handle objects (like inclusion) vs arrays (like loans)
    if (collectionData && !Array.isArray(collectionData)) {
      // Convert object to array of objects with ids
      const docsArray = Object.keys(collectionData).map(key => {
        return {
          id: key,
          ...(collectionData as any)[key]
        };
      });
      return {
        docs: docsArray
      };
    }
    
    return {
      // Return a function that will be used by getDocs
      // This simulates Firestore's collection reference
      docs: (collectionData || []),
    };
  }
}

// Create instances of our mock services
const auth = new MockAuth();
const db = new MockFirestore();

// Functions to match Firebase's API
function getDoc(docRef: any) {
  // If docRef is for a user, return user data
  if (docRef.collection === 'users') {
    const userData = (mockData as any).users[docRef.id];
    if (userData) {
      return Promise.resolve(new MockDocumentSnapshot(userData, docRef.id));
    }
  }
  
  // Return empty doc if not found
  return Promise.resolve(new MockDocumentSnapshot(null, docRef.id));
}

function getDocs(collectionRef: any) {
  return Promise.resolve(new MockQuerySnapshot(collectionRef.docs || []));
}

export { auth, db, getDoc, getDocs }; 
