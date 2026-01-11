import React from 'react';
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from '@/components/ui/select';

interface ReusableSelectProps {
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: string[];
}

const ReusableSelect: React.FC<ReusableSelectProps> = ({
  value,
  disabled = false,
  onValueChange,
  placeholder,
  items
}) => {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-plus-jakarta-sans">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50] cursor-pointer">
        {items.map(item => (
          <SelectItem 
            key={item} 
            value={item}
            className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans"
          >
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReusableSelect;