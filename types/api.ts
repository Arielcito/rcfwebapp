export interface User {
  id: string;
  email: string;
  name: string;
  telefono: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Predio {
  id: string;
  usuario_id: string | null;
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
  predioId: string;
  nombre: string;
  tipo: string | null;
  capacidadJugadores: number | null;
  longitud: number | null;
  ancho: number | null;
  tipoSuperficie: string | null;
  tieneIluminacion: boolean | null;
  esTechada: boolean | null;
  precioPorHora: string;
  estado: string | null;
  ultimoMantenimiento: string | null;
  equipamientoIncluido: string | null;
  imagenUrl: string | null;
  createdAt: string;
  requiereSeña: boolean;
  montoSeña: number;
  
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
  nombre: string;
  predioId: string;
  tipo?: string;
  capacidadJugadores?: number;
  longitud?: number;
  ancho?: number;
  tipoSuperficie?: string;
  tieneIluminacion?: boolean;
  esTechada?: boolean;
  precioPorHora: string;
  estado?: string;
  ultimoMantenimiento?: string;
  equipamientoIncluido?: string;
  imagenUrl?: string;
  imagen?: string;
  requiereSeña: boolean;
  montoSeña: number;
}

export interface UpdateCanchaData {
  nombre?: string;
  tipo?: string;
  capacidadJugadores?: number;
  longitud?: number;
  ancho?: number;
  tipoSuperficie?: string;
  tieneIluminacion?: boolean;
  esTechada?: boolean;
  precioPorHora?: string;
  estado?: string;
  ultimoMantenimiento?: string;
  equipamientoIncluido?: string;
  imagenUrl?: string;
  requiereSeña?: boolean;
  montoSeña?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: string
  canchaId: string
  userId: string
  fechaHora: string
  duracion: number
  precioTotal: string
  estadoPago: string
  metodoPago: string
  fechaReserva: string
  notasAdicionales: string
  pagoId: string | null
} 