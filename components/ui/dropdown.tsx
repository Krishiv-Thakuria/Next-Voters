const Dropdown = ({
  label,
  value,
  options = [], // Default to an empty array if options is undefined
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => (
  <div className="inline-flex items-center rounded-lg px-2 py-2 hover:bg-gray-50">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-transparent pr-0 text-[16px] text-gray-800 font-plus-jakarta-sans focus:outline-none"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <svg
      className="ml-2 h-4 w-4 text-gray-500 pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
);

export default Dropdown;