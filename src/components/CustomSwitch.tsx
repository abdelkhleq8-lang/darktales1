import React from 'react';

interface CustomSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  sublabel,
  icon,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const isSm = size === 'sm';

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      id={id}
      className={`flex items-center justify-between gap-3 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={handleToggle}
    >
      {(label || icon) && (
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <div
              className={`shrink-0 transition-colors duration-300 ${
                checked ? 'text-red-500 scale-110' : 'text-[#ac8884]'
              }`}
            >
              {icon}
            </div>
          )}
          <div className="flex flex-col min-w-0 text-right">
            {label && (
              <span className={`text-xs md:text-sm font-medium tracking-wide transition-colors ${
                checked ? 'text-white' : 'text-[#e5e1e4]'
              }`}>
                {label}
              </span>
            )}
            {sublabel && (
              <span className="text-[11px] text-[#ac8884] truncate">
                {sublabel}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Switch Track & Thumb */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'تبديل المؤثرات الصوتية'}
        disabled={disabled}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131315] ${
          isSm ? 'h-5 w-9' : 'h-6 w-11'
        } ${
          checked
            ? 'bg-red-600 shadow-[0_0_14px_rgba(220,38,38,0.7)] border border-red-500/80'
            : 'bg-[#2a2a2e] hover:bg-[#34343a] border border-white/10'
        }`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full transform transition-all duration-300 ease-out shadow-md ${
            isSm ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
          } ${
            checked
              ? isSm
                ? '-translate-x-4.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                : '-translate-x-5.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
              : '-translate-x-0.5 bg-[#a1a1aa]'
          }`}
        />
      </button>
    </div>
  );
};
