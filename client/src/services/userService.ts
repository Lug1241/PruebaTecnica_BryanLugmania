import { ApiResponse, Usuario, UsuarioCreatePayload, UsuarioUpdatePayload, UserFilterParams } from '@/types/user.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7256/api';

export const userService = {
  async getAll(filters?: UserFilterParams): Promise<Usuario[]> {
    const params = new URLSearchParams();
    if (filters?.buscar) params.append('buscar', filters.buscar);
    if (filters?.rol) params.append('rol', filters.rol);
    if (filters?.estado !== undefined) params.append('estado', String(filters.estado));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/usuarios${query}`, { cache: 'no-store' });
    const json: ApiResponse<Usuario[]> = await res.json();
    
    if (!res.ok || json.error) throw new Error(json.message || 'Error al listar usuarios');
    return json.data;
  },

  async create(payload: UsuarioCreatePayload): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Error al crear usuario');
  },

  async update(id: number, payload: UsuarioUpdatePayload): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Error al actualizar usuario');
  },

  async toggleStatus(id: number, currentStatus: boolean): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: !currentStatus }),
    });
    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Error al cambiar estado');
  },

  async deleteOne(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });
    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Error al eliminar usuario');
  },

  async deleteBulk(ids: number[]): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios/eliminar-masivo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Error en eliminación masiva');
  },
};