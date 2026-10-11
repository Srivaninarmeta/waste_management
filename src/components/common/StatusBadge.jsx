import React from 'react';
import { Clock, UserCheck, CheckCircle2, Truck, CheckCheck, XCircle } from 'lucide-react';

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    className: 'badge-status-pending',
    icon: Clock,
  },
  ASSIGNED: {
    label: 'Assigned',
    className: 'badge-status-assigned',
    icon: UserCheck,
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'badge-status-accepted',
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'badge-status-in-progress',
    icon: Truck,
  },
  COLLECTED: {
    label: 'Collected',
    className: 'badge-status-collected',
    icon: CheckCheck,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'badge-status-cancelled',
    icon: XCircle,
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: status,
    className: 'badge-status-pending',
    icon: Clock,
  };
  const Icon = config.icon;

  return (
    <span className={`badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 ${config.className}`}>
      <Icon size={14} className="flex-shrink-0" />
      <span className="fw-semibold">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
