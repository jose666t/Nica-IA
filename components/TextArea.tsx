import React, { ForwardedRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, id, error, className = '', ...props }, ref: ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref} // Assign the forwarded ref here
          className={`bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea'; // Good practice for forwardRef components

export default TextArea;