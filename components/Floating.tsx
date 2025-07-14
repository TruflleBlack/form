// components/Floating.tsx
import React from 'react';

export type FloatingProps = {
  id: string;
  label: string;
  children: React.ReactElement;
};

export function Floating({ id, label, children }: FloatingProps) {
  const child = React.cloneElement(children, {
    id,
    placeholder: ' ',
    className: `${children.props.className} peer placeholder-transparent pt-6`,
  });

  return (
    <div className="relative z-0 w-full pt-2">
      {child}
      <label
        htmlFor={id}
        className={`
          absolute left-3
          top-5 scale-75 text-xs      /* default: agak turun */
            origin-left transition-all duration-200

          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:text-base

          peer-focus:top-5
          peer-focus:scale-75
          peer-focus:text-xs

          bg-[#EBE8DB] px-1 pointer-events-none text-gray-500
          peer-focus:text-[#B03052]
        `}
      >
        {label}
      </label>
    </div>
  );
}
