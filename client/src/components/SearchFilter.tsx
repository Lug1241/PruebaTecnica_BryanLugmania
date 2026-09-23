'use client';

import React from 'react';
import { UserFilterParams } from '@/types/user.types';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface Props {
  filters: UserFilterParams;
  onChange: (newFilters: UserFilterParams) => void;
}

export const SearchFilter: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={filters.buscar || ''}
          onChange={(e) => onChange({ ...filters, buscar: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-1">
          <Filter className="w-4 h-4" />
          <span>Filtros:</span>
        </div>

        <select
          value={filters.rol || ''}
          onChange={(e) => onChange({ ...filters, rol: e.target.value || undefined })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Usuario">Usuario</option>
        </select>

        <select
          value={filters.estado === undefined ? '' : String(filters.estado)}
          onChange={(e) => {
            const val = e.target.value;
            onChange({
              ...filters,
              estado: val === '' ? undefined : val === 'true',
            });
          }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        {(filters.buscar || filters.rol || filters.estado !== undefined) && (
          <button
            onClick={() => onChange({})}
            title="Limpiar filtros"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};