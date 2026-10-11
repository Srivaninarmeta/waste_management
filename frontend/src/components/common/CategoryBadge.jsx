import React from 'react';
import { Trash2, Recycle, Apple, Monitor, AlertTriangle, HardHat } from 'lucide-react';

const categoryConfig = {
  GENERAL: { label: 'General Waste', className: 'badge-cat-general', icon: Trash2 },
  RECYCLABLE: { label: 'Recyclables', className: 'badge-cat-recyclable', icon: Recycle },
  ORGANIC: { label: 'Organic / Green', className: 'badge-cat-organic', icon: Apple },
  E_WASTE: { label: 'E-Waste', className: 'badge-cat-ewaste', icon: Monitor },
  HAZARDOUS: { label: 'Hazardous', className: 'badge-cat-hazardous', icon: AlertTriangle },
  CONSTRUCTION: { label: 'Construction', className: 'badge-cat-construction', icon: HardHat },
};

const CategoryBadge = ({ category }) => {
  const config = categoryConfig[category] || {
    label: category,
    className: 'badge-cat-general',
    icon: Trash2,
  };
  const Icon = config.icon;

  return (
    <span className={`badge rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1.5 ${config.className}`}>
      <Icon size={13} className="flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge;
