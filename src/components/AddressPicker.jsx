import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

function Dropdown({ label, value, options, onChange, loading, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find(o => o.code === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">{label}</label>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => { setOpen(!open); setSearch(''); }}
        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none text-left flex items-center justify-between transition-all
          ${open ? 'bg-white border-[#1B83A1]' : 'border-transparent'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white hover:border-gray-200 cursor-pointer'}`}
      >
        <span className={`truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {loading ? 'Đang tải...' : (selected?.name || placeholder)}
        </span>
        <ChevronDown size={14} className={`text-gray-400 shrink-0 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-7 pr-3 py-1.5 bg-gray-50 rounded-lg text-sm outline-none"
              />
            </div>
          </div>
          <div className="max-h-44 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-3">Không tìm thấy</p>
            ) : filtered.map(o => (
              <button
                key={o.code}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#1B83A1]/5 transition-colors
                  ${value === o.code ? 'font-bold text-[#1B83A1] bg-[#1B83A1]/5' : 'text-gray-700'}`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Normalize string for matching (remove diacritics, lowercase)
function normalize(str) {
  return (str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd');
}

export default function AddressPicker({ streetAddress, onStreetChange, onAddressChange, initialAddress }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [loadingP, setLoadingP] = useState(false);
  const [loadingD, setLoadingD] = useState(false);
  const [loadingW, setLoadingW] = useState(false);
  const initialized = useRef(false);

  // Fetch provinces on mount
  useEffect(() => {
    setLoadingP(true);
    fetch('https://provinces.open-api.vn/api/p/')
      .then(r => r.json())
      .then(data => setProvinces(data))
      .catch(() => {})
      .finally(() => setLoadingP(false));
  }, []);

  // Auto-fill from initialAddress when provinces loaded
  useEffect(() => {
    if (!initialAddress || !provinces.length || initialized.current) return;
    // Parse: "68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh"
    const parts = initialAddress.split(',').map(s => s.trim());
    if (parts.length < 2) return;

    const provinceName = parts[parts.length - 1];
    const matchedProvince = provinces.find(p => normalize(p.name).includes(normalize(provinceName)) || normalize(provinceName).includes(normalize(p.name)));
    if (matchedProvince) {
      setProvince(matchedProvince);
      // Store remaining parts for district/ward matching
      const remaining = parts.slice(0, -1);
      sessionStorage.setItem('_addr_parts', JSON.stringify(remaining));
    }
    initialized.current = true;
  }, [provinces, initialAddress]);

  // Fetch districts when province changes
  useEffect(() => {
    if (!province) { setDistricts([]); setDistrict(null); setWards([]); setWard(null); return; }
    setLoadingD(true);
    setDistrict(null); setWards([]); setWard(null);
    fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
      .then(r => r.json())
      .then(data => {
        const dists = data.districts || [];
        setDistricts(dists);
        // Auto-match district
        const parts = JSON.parse(sessionStorage.getItem('_addr_parts') || '[]');
        if (parts.length >= 2) {
          const districtName = parts[parts.length - 1];
          const matched = dists.find(d => normalize(d.name).includes(normalize(districtName)) || normalize(districtName).includes(normalize(d.name)));
          if (matched) setDistrict(matched);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingD(false));
  }, [province]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!district) { setWards([]); setWard(null); return; }
    setLoadingW(true);
    setWard(null);
    fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
      .then(r => r.json())
      .then(data => {
        const ws = data.wards || [];
        setWards(ws);
        // Auto-match ward
        const parts = JSON.parse(sessionStorage.getItem('_addr_parts') || '[]');
        if (parts.length >= 2) {
          const wardName = parts[parts.length - 2];
          const matched = ws.find(w => normalize(w.name).includes(normalize(wardName)) || normalize(wardName).includes(normalize(w.name)));
          if (matched) setWard(matched);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingW(false));
  }, [district]);

  // Notify parent when address changes
  useEffect(() => {
    const parts = [streetAddress, ward?.name, district?.name, province?.name].filter(Boolean);
    onAddressChange({
      address: parts.join(', '),
      city: province?.name || '',
    });
  }, [streetAddress, ward, district, province]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Dropdown label="Tỉnh / Thành phố" value={province?.code} options={provinces}
          onChange={p => { initialized.current = false; setProvince(p); }} loading={loadingP} placeholder="Chọn tỉnh / TP" />
        <Dropdown label="Quận / Huyện" value={district?.code} options={districts}
          onChange={d => setDistrict(d)} loading={loadingD} disabled={!province} placeholder="Chọn quận / huyện" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Dropdown label="Phường / Xã" value={ward?.code} options={wards}
          onChange={w => setWard(w)} loading={loadingW} disabled={!district} placeholder="Chọn phường / xã" />
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Số nhà / Đường</label>
          <input
            value={streetAddress}
            onChange={e => onStreetChange(e.target.value)}
            placeholder="123 Nguyễn Huệ"
            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-[#1B83A1] transition-all"
          />
        </div>
      </div>
    </div>
  );
}
