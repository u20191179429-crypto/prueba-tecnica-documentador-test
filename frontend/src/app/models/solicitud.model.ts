/**
 * Interface que representa una solicitud en el sistema.
 */
export interface Solicitud {
  id?: number;
  tipo: string;
  asunto: string;
  descripcion: string;
  prioridad: string;
  estado?: string;
  fechaCreacion?: string;
}
