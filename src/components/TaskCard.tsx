import React from 'react';

interface TaskCardProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  reward: string;
  buttonText: string;
  buttonColor: string;
  badge?: string;
  redTag?: boolean;
  progress?: string;
  onClick?: () => void;
}

export function TaskCard({
  icon,
  iconBg,
  title,
  description,
  reward,
  buttonText,
  buttonColor,
  badge,
  redTag,
  progress,
  onClick,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 text-2xl relative`}>
        {badge && (
          <div className="absolute -top-1 -left-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded">
            {badge}
          </div>
        )}
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {reward && (
            <span className="inline-flex items-center text-sm">
              <span className="text-yellow-500">💰</span>
              <span className={`${redTag ? 'text-red-500' : 'text-orange-500'}`}>
                {reward}
              </span>
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        {progress && (
          <div className="mt-2 bg-gray-50 rounded px-3 py-1.5">
            <p className="text-xs text-gray-600">{progress}</p>
          </div>
        )}
      </div>

      {/* Button */}
      <button 
        onClick={onClick} 
        className={`${buttonColor} text-white px-4 py-2 rounded-full text-sm flex-shrink-0 shadow-sm`}>
        {buttonText}
      </button>
    </div>
  );
}
