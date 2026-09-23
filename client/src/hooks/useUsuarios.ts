'use client';

import { useState, useEffect, useCallback } from 'react';
import { Usuario, UserFilterParams, UsuarioCreatePayload, UsuarioUpdatePayload } from '@/types/user.types';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<UserFilterParams>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getAll(filters);
      setUsuarios(data);
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleCreate = async (payload: UsuarioCreatePayload) => {
    try {
      await userService.create(payload);
      toast.success('Usuario creado con éxito');
      await fetchUsuarios();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Error al crear usuario');
      return false;
    }
  };

  const handleUpdate = async (id: number, payload: UsuarioUpdatePayload) => {
    try {
      await userService.update(id, payload);
      toast.success('Usuario actualizado con éxito');
      await fetchUsuarios();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar usuario');
      return false;
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await userService.toggleStatus(id, currentStatus);
      toast.success(`Estado cambiado a ${!currentStatus ? 'Activo' : 'Inactivo'}`);
      await fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar estado');
    }
  };

  const handleDeleteOne = async (id: number) => {
    try {
      await userService.deleteOne(id);
      toast.success('Usuario eliminado exitosamente');
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      await fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar usuario');
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    try {
      await userService.deleteBulk(selectedIds);
      toast.success(`Se eliminaron ${selectedIds.length} usuario(s) exitosamente`);
      setSelectedIds([]);
      await fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || 'Error en eliminación masiva');
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(usuarios.map((u) => u.idUsuario));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    usuarios,
    loading,
    filters,
    setFilters,
    selectedIds,
    handleCreate,
    handleUpdate,
    handleToggleStatus,
    handleDeleteOne,
    handleDeleteBulk,
    toggleSelectAll,
    toggleSelectOne,
    refresh: fetchUsuarios,
  };
}