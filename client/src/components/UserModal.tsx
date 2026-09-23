'use client';

import React, { useState, useEffect } from 'react';
import { Usuario, UsuarioCreatePayload, UsuarioUpdatePayload } from '@/types/user.types';
import { X, UserPlus, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: Usuario | null;
  onSubmitCreate: (data: UsuarioCreatePayload) => Promise<boolean>;
  onSubmitUpdate: (id: number, data: UsuarioUpdatePayload) => Promise<boolean>;
}

export const UserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userToEdit,
  onSubmitCreate,
  onSubmitUpdate,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    rol: 'Usuario',
    estado: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre,
        apellido: userToEdit.apellido,
        correo: userToEdit.correo,
        clave: '',
        rol: userToEdit.rol,
        estado: userToEdit.estado,
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        clave: '',
        rol: 'Usuario',
        estado: true,
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let success = false;
    if (userToEdit) {
      success = await onSubmitUpdate(userToEdit.idUsuario, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        rol: formData.rol,
      });
    } else {
      success = await onSubmitCreate({
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        clave: formData.clave,
        rol: formData.rol,
        estado: formData.estado,
      });
    }

    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {userToEdit ? <Save className="w-5 h-5 text-blue-600" /> : <UserPlus className="w-5 h-5 text-blue-600" />}
            <h3 className="font-semibold text-gray-800 text-lg">
              {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
              <input
                required
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              required
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {!userToEdit && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                required
                minLength={6}
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.clave}
                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>
            {!userToEdit && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={String(formData.estado)}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value === 'true' })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};