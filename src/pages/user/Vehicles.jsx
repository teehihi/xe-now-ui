import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const Vehicles = () => {
  const navigate = useNavigate();
  
  // State for vehicles from API
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await api.get('/vehicles');
        
        // Transform data to match frontend format
        const transformedData = data.map(vehicle => ({
          ...vehicle,
          pricePerDay: Number(vehicle.pricePerDay),
          status: vehicle.status.toLowerCase()
        }));
        
        setVehicles(transformedData);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all', // all, car, motorcycle
    type: [],
    brand: [],
    model: [], // NEW: filter by model
    seats: [],
    transmission: [],
    location: [],
    priceRange: [0, 5000000],
    yearRange: [2020, 2024]
  });

  const [showFilters, setShowFilters] = useState(true);

  // Extract unique values for filters based on category
  const filterOptions = useMemo(() => {
    // Filter vehicles by category first
    const categoryVehicles = filters.category === 'all' 
      ? vehicles 
      : vehicles.filter(v => v.category === filters.category);
    
    const types = [...new Set(categoryVehicles.map(v => v.type))].filter(Boolean);
    const brands = [...new Set(categoryVehicles.map(v => v.brand))].filter(Boolean);
    const models = [...new Set(categoryVehicles.map(v => v.model))].filter(Boolean).sort();
    const seats = [...new Set(categoryVehicles.map(v => v.seats))].filter(Boolean).sort((a, b) => a - b);
    const transmissions = [...new Set(categoryVehicles.map(v => v.transmission))].filter(Boolean);
    const locations = [...new Set(categoryVehicles.map(v => v.location))].filter(Boolean);
    
    return { types, brands, models, seats, transmissions, locations };
  }, [filters.category, vehicles]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Category filter
      if (filters.category !== 'all' && vehicle.category !== filters.category) return false;
      
      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(vehicle.type)) return false;
      
      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(vehicle.brand)) return false;
      
      // Model filter (NEW)
      if (filters.model.length > 0 && !filters.model.includes(vehicle.model)) return false;
      
      // Seats filter
      if (filters.seats.length > 0 && !filters.seats.includes(vehicle.seats)) return false;
      
      // Transmission filter
      if (filters.transmission.length > 0 && !filters.transmission.includes(vehicle.transmission)) return false;
      
      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(vehicle.location)) return false;
      
      // Price range filter
      if (vehicle.pricePerDay < filters.priceRange[0] || vehicle.pricePerDay > filters.priceRange[1]) return false;
      
      // Year range filter
      if (vehicle.year < filters.yearRange[0] || vehicle.year > filters.yearRange[1]) return false;
      
      return true;
    });
  }, [vehicles, filters]);

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  // Handle category change - clear type, brand, model, seats filters when category changes
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category,
      type: [],
      brand: [],
      model: [],
      seats: []
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      type: [],
      brand: [],
      model: [],
      seats: [],
      transmission: [],
      location: [],
      priceRange: [0, 5000000],
      yearRange: [2020, 2024]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Danh sách xe</h1>
          <p className="text-gray-600">Tìm xe phù hợp với nhu cầu của bạn</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Lỗi: {error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
          <aside className="w-80 shrink-0">
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-h-[calc(100vh-96px)] flex flex-col">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#1B83A1] hover:text-[#1B83A1]/80"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto scrollbar-hide flex-1">
                {/* Category */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {['all', 'car', 'motorcycle'].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat}
                          onChange={() => handleCategoryChange(cat)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">
                          {cat === 'all' ? 'Tất cả' : cat === 'car' ? 'Ô tô' : 'Xe máy'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Loại xe</h3>
                  <div className="space-y-2">
                    {filterOptions.types.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => toggleFilter('type', type)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Hãng xe</h3>
                  <div className="space-y-2">
                    {filterOptions.brands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand)}
                          onChange={() => toggleFilter('brand', brand)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Model (NEW) */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Dòng xe</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                    {filterOptions.models.map(model => (
                      <label key={model} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.model.includes(model)}
                          onChange={() => toggleFilter('model', model)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Số chỗ ngồi</h3>
                  <div className="space-y-2">
                    {filterOptions.seats.map(seat => (
                      <label key={seat} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.seats.includes(seat)}
                          onChange={() => toggleFilter('seats', seat)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{seat} chỗ</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Hộp số</h3>
                  <div className="space-y-2">
                    {filterOptions.transmissions.map(trans => (
                      <label key={trans} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.transmission.includes(trans)}
                          onChange={() => toggleFilter('transmission', trans)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{trans}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Chi nhánh</h3>
                  <div className="space-y-2">
                    {filterOptions.locations.map(loc => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(loc)}
                          onChange={() => toggleFilter('location', loc)}
                          className="w-4 h-4 accent-[#1B83A1]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Giá thuê/ngày</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="100000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)]
                      }))}
                      className="w-full accent-[#1B83A1]"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0đ</span>
                      <span>{filters.priceRange[1].toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-3">Năm sản xuất</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="2020"
                      max="2024"
                      value={filters.yearRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        yearRange: [parseInt(e.target.value), 2024]
                      }))}
                      className="w-full accent-[#1B83A1]"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{filters.yearRange[0]}</span>
                      <span>2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50"
                >
                  {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>
                <p className="text-gray-600">
                  Tìm thấy <span className="text-gray-900 font-semibold">{filteredVehicles.length}</span> xe
                </p>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#1B83A1] hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#1B83A1]/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {vehicle.type}
                      </span>
                    </div>
                    {vehicle.status !== 'available' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {vehicle.status === 'rented' ? 'Đang thuê' : 'Bảo trì'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#1B83A1] transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{vehicle.brand}</p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{vehicle.seats} chỗ</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{vehicle.year}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{vehicle.location}</span>
                    </div>

                    {/* Price & Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-2xl font-bold text-[#1B83A1]">
                          {vehicle.pricePerDay.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-xs text-gray-500">/ ngày</p>
                      </div>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        disabled={vehicle.status !== 'available'}
                        className="px-4 py-2 bg-[#1B83A1] text-white rounded-lg hover:bg-[#1B83A1]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe phù hợp</h3>
                <p className="text-gray-600 mb-4">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#1B83A1] text-white rounded-lg hover:bg-[#1B83A1]/80"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
