'use client'; 

import { useState, ChangeEvent } from 'react';

type ChatPageProps = {
  params: { id: string };
};

const countryData: Record<string, string[]> = {
  USA: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  Canada: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
};

export default function ChatPage({ params }: ChatPageProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedRegion('');
    setRegions(countryData[country] || []);
  };

  const handleRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <>
    <div>
      <h1>Chat Session for Election: {params.id}</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Where are you from?</h2>
        <div>
          <label htmlFor="country-select" style={{ marginRight: '10px' }}>Country:</label>
          <select id="country-select" value={selectedCountry} onChange={handleCountryChange}>
            <option value="">--Select Country--</option>
            {Object.keys(countryData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && regions.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <label htmlFor="region-select" style={{ marginRight: '10px' }}>
              {selectedCountry === 'USA' ? 'State:' : selectedCountry === 'Canada' ? 'Province:' : 'Region:'}
            </label>
            <select id="region-select" value={selectedRegion} onChange={handleRegionChange}>
              <option value="">--Select Region--</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedCountry && selectedRegion && (
        <div>
          <h2>Chat Window</h2>
          <p>Chatting about election: {params.id}</p>
          <p>Location: {selectedRegion}, {selectedCountry}</p>
          {/* Placeholder for actual chat interface */}
          <div style={{ border: '1px solid #ccc', height: '300px', padding: '10px', overflowY: 'auto' }}>
            <p>Chat messages will appear here...</p>
          </div>
        </div>
      )}

      {!selectedCountry && (
        <p>Please select a country to proceed.</p>
      )}
      {selectedCountry && !selectedRegion && regions.length > 0 && (
         <p>Please select a region to see the chat.</p>
      )}

    </div>
    </>
  );
}
