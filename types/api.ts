export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Predio {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cancha {
  id: string;
  name: string;
  predioId: string;
  type: string;
  size: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreatePredioData {
  name: string;
  address: string;
}

export interface UpdatePredioData {
  name?: string;
  address?: string;
}

export interface CreateCanchaData {
  name: string;
  predioId: string;
  type: string;
  size: string;
  price: number;
}

export interface UpdateCanchaData {
  name?: string;
  type?: string;
  size?: string;
  price?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  canchaId: string
  userId: string
  status: BookingStatus
  price: number
  userName: string
  canchaName: string
  createdAt: string
  updatedAt: string
} 