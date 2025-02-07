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
  usuarioId: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  cbu?: string;
  titularCuenta?: string;
  tipoCuenta?: string;
  banco?: string;
  numeroCuenta?: string;
  latitud?: number;
  longitud?: number;
  capacidadEstacionamiento?: number;
  tieneVestuarios?: boolean;
  tieneCafeteria?: boolean;
  horarioApertura?: string;
  horarioCierre?: string;
  diasOperacion?: string;
  imagenUrl?: string;
  fechaRegistro?: Date;
}

export interface PredioCreationData {
  usuarioId: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  cbu?: string;
  titularCuenta?: string;
  tipoCuenta?: string;
  banco?: string;
  numeroCuenta?: string;
  latitud?: number;
  longitud?: number;
  capacidadEstacionamiento?: number;
  tieneVestuarios?: boolean;
  tieneCafeteria?: boolean;
  horarioApertura?: string;
  horarioCierre?: string;
  diasOperacion?: string;
  imagenUrl?: string;
}

export interface PredioUpdateData extends Partial<PredioCreationData> {}

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
  usuarioId: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  cbu?: string;
  titularCuenta?: string;
  tipoCuenta?: string;
  banco?: string;
  numeroCuenta?: string;
  latitud?: number;
  longitud?: number;
  capacidadEstacionamiento?: number;
  tieneVestuarios?: boolean;
  tieneCafeteria?: boolean;
  horarioApertura?: string;
  horarioCierre?: string;
  diasOperacion?: string;
  imagenUrl?: string;
}

export interface UpdatePredioData extends Partial<CreatePredioData> {}

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

export interface CategoriaMovimiento {
  id: string
  nombre: string
  tipo: 'INGRESO' | 'EGRESO'
  descripcion?: string
  activo: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MovimientoCaja {
  id: string
  predioId: string
  categoriaId: string
  concepto: string
  monto: number
  tipo: 'INGRESO' | 'EGRESO'
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'DEBITO' | 'CREDITO' | 'MERCADOPAGO' | 'OTRO'
  fechaMovimiento: string
  comprobante?: string
  notasAdicionales?: string
  createdAt?: string
  updatedAt?: string
}

export interface MovimientoCajaCreationData {
  predioId: string
  categoriaId: string
  concepto: string
  monto: number
  tipo: 'INGRESO' | 'EGRESO'
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'DEBITO' | 'CREDITO' | 'MERCADOPAGO' | 'OTRO'
  fechaMovimiento: string
  comprobante?: string
  notasAdicionales?: string
}

export interface MovimientoCajaUpdateData extends Partial<MovimientoCajaCreationData> {}

export interface MovimientoStats {
  totalIngresos: number
  totalEgresos: number
  balance: number
  movimientosPorCategoria: {
    categoriaId: string
    categoriaNombre: string
    total: number
    cantidad: number
  }[]
  movimientosPorMetodoPago: {
    metodoPago: string
    total: number
    cantidad: number
  }[]
} 