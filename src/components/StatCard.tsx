import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <Icon className="w-8 h-8 text-purple-500" />
      </div>
    </div>
  );
};

export default StatCard;