  export function formatearFechaCorta(fecha: Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }