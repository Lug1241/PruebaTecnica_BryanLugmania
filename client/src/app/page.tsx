'use client';

import React, { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { SearchFilter } from '@/components/SearchFilter';
import { UserTable } from '@/components/UserTable';
import { UserModal } from '@/components/UserModal';
import { Usuario } from '@/types/user.types';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { Toaster } from 'sonner';

export default function Home() {
  const {
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
  } = useUsuarios();

  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  const openCreateModal = () => {
    setUserToEdit(null);
    setModalOpen(true);
  };

  const openEditModal = (usuario: Usuario) => {
    setUserToEdit(usuario);
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Administra el listado, creación, edición y estados de los usuarios del sistema.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar ${selectedIds.length} usuario(s)?`)) {
                    handleDeleteBulk();
                  }
                }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition animate-in fade-in"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar ({selectedIds.length})
              </button>
            )}

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Filtros */}
        <SearchFilter filters={filters} onChange={setFilters} />

        {/* Tabla */}
        <UserTable
          usuarios={usuarios}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDeleteOne={handleDeleteOne}
        />
      </div>

      {/* Modal Crear / Editar */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userToEdit={userToEdit}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
      />
    </main>
  );
}