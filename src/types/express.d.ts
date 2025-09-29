
import 'express'; // This is just to ensure 'express' is treated as a module dependency

// This is the key change: Augment the 'express' module itself
declare module 'express' {
  // TypeScript will find the existing Request interface inside the 'express' module
  interface Request {
    user?: {
      id: string;
      role: string;
      email: string;
    };
    validatedQuery?: any;
  }
}

// export {} is generally needed to ensure this file is treated as a module, 
// which is required for module augmentation to work.
export {}; 