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
  usuarioId: string | null;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string | null;
  telefono: string;
  email: string | null;
  latitud: string;
  longitud: string;
  capacidadEstacionamiento: number | null;
  tieneVestuarios: boolean | null;
  tieneCafeteria: boolean | null;
  horarioApertura: string;
  horarioCierre: string;
  diasOperacion: string[] | null;
  imagenUrl: string | null;
  fechaRegistro: string;
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
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
  telefono: string;
  email?: string;
  latitud: string;
  longitud: string;
  capacidadEstacionamiento?: number;
  tieneVestuarios?: boolean;
  tieneCafeteria?: boolean;
  horarioApertura: string;
  horarioCierre: string;
  diasOperacion?: string[];
  imagenUrl?: string;
}

export interface UpdatePredioData {
  nombre?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  latitud?: string;
  longitud?: string;
  capacidadEstacionamiento?: number;
  tieneVestuarios?: boolean;
  tieneCafeteria?: boolean;
  horarioApertura?: string;
  horarioCierre?: string;
  diasOperacion?: string[];
  imagenUrl?: string;
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