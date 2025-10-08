import React from 'react'
import usePreference from '@/hooks/preferences';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import supportedRegions from '@/data/supported-regions';

const PreferenceSelector = () => {
    const { handleSetPreference, handleGetPreference } = usePreference();
    const preference = handleGetPreference();
    
  return (
    <div>
      {/* Selection Controls */}
      <div className="flex space-x-2 mt-3">
        <Select 
          value={preference?.region || ""} 
          onValueChange={(value) => handleSetPreference(value)}
        >
          <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
            {supportedRegions.map(region => (
              <SelectItem 
                key={region.code} 
                value={region.name} 
                className="hover:bg-gray-100 focus:bg-gray-100 font-poppins"
              >
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PreferenceSelector