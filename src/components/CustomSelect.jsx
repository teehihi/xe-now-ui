import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ label, options, value, onChange, placeholder, getLabel, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const selectedOption = options.find(o => String(o.id) === String(value));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`space-y-1 relative ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm flex items-center justify-between cursor-pointer border border-transparent focus-within:border-blue-500 transition-all font-medium min-h-[40px]"
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? (getLabel ? getLabel(selectedOption) : selectedOption.name) : placeholder}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto py-1">
                    {options.length > 0 ? (
                        options.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.id);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${String(opt.id) === String(value) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'}`}
                            >
                                {getLabel ? getLabel(opt) : opt.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-400 italic">Không có dữ liệu</div>
                    )}
                </div>
            )}
        </div>
    );
}
