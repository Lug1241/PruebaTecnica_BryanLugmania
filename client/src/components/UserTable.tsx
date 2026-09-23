'use client';

import React from 'react';
import { Usuario } from '@/types/user.types';
import { Edit2, Trash2, Power, Shield, User as UserIcon } from 'lucide-react';

interface Props {
  usuarios: Usuario[];
  loading: boolean;
  selectedIds: number[];
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: number) => void;
  onEdit: (usuario: Usuario) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDeleteOne: (id: number) => void;
}

export const UserTable: React.FC<Props> = ({
  usuarios,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onEdit,
  onToggleStatus,
  onDeleteOne,
}) => {
  const allSelected = usuarios.length > 0 && selectedIds.length === usuarios.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < usuarios.length;

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Cargando usuarios...</p>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-12 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2 text-base font-medium text-gray-800">No se encontraron usuarios</p>
        <p className="text-sm text-gray-500">Intenta cambiar los filtros de búsqueda o agrega un nuevo usuario.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              <th className="p-4 w-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha Creación</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((u) => {
              const isSelected = selectedIds.includes(u.idUsuario);
              return (
                <tr
                  key={u.idUsuario}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(u.idUsuario)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {u.nombre} {u.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.correo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <Shield className="w-3 h-3 text-gray-500" />
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.estado
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {u.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(u.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(u.idUsuario, u.estado)}
                      title={u.estado ? 'Desactivar usuario' : 'Activar usuario'}
                      className={`p-1.5 rounded-lg border transition ${
                        u.estado
                          ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                          : 'text-green-600 border-green-200 hover:bg-green-50'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(u)}
                      title="Editar usuario"
                      className="p-1.5 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al usuario ${u.nombre} ${u.apellido}?`)) {
                          onDeleteOne(u.idUsuario);
                        }
                      }}
                      title="Eliminar usuario"
                      className="p-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};