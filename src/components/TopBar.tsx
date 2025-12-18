interface TopBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function TopBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search stations, subscribers etc',
}: TopBarProps) {
  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-40">
      <div className="px-8 h-20 flex justify-between items-center">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {onSearchChange ? (
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-sky-50 border-0 rounded-lg text-gray-900 placeholder-sky-400 focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            ) : (
              <div className="w-full pl-10 pr-4 py-2.5 bg-sky-50 rounded-lg text-sky-400 text-sm">{searchPlaceholder}</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-sky-200">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-200">
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0EA5E9&color=fff&size=128" 
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="text-sky-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
