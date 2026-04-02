import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, ShieldCheck, FileText, Car, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import Toast from '../../components/Toast';

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ step }) {
  const steps = [
    { id: 1, label: 'CCCD/CMND' },
    { id: 2, label: 'GPLX' },
    { id: 3, label: 'Xác nhận' },
  ];
  return (
    <div className="flex items-center justify-center">
      {steps.map((s, i) => {
        const active = step >= s.id;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base transition-all"
                style={active
                  ? { background: 'linear-gradient(90deg,#1B83A1 0%,#3B82F6 100%)', color: '#fff' }
                  : { background: '#E2E8F0', color: '#90A1B9' }}>
                {s.id}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="w-24 h-1"
                style={{ background: step > s.id ? 'linear-gradient(90deg,#1B83A1,#3B82F6)' : '#E2E8F0' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Upload Zone ────────────────────────────────────────────────────────── */
function UploadZone({ file, onFile, uploadColor = '#1B83A1', label = 'Chọn ảnh' }) {
  const ref = useRef();
  return (
    <div className="border-2 border-dashed border-[#CAD5E2] rounded-2xl w-full"
      style={{ padding: '34px 34px 34px' }}>
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <img src={file} alt="preview" className="max-h-48 rounded-xl object-contain shadow" />
          <button onClick={() => onFile(null)}
            className="text-xs text-[#62748E] bg-white px-3 py-1 rounded-full border border-gray-200">
            Chọn lại
          </button>
        </div>
      ) : (
        <div className="flex flex-col" style={{ minHeight: 200 }}>
          {/* Text — centered, fills remaining space */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            {/* Icon circle — centered */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
              style={{ background: '#F1F5F9' }}>
              <Upload size={24} color="#90A1B9" />
            </div>
            <p className="text-base text-center text-[#314158]">{label}</p>
            <p className="text-sm text-center text-[#62748E]">PNG, JPG tối đa 10MB</p>
          </div>

          {/* Buttons — centered at bottom */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <label className="cursor-pointer">
              <input ref={ref} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(URL.createObjectURL(f)); }} />
              <span className="flex items-center gap-1.5 px-4 rounded-full text-sm font-medium text-white"
                style={{ background: uploadColor, height: 36, lineHeight: '36px' }}>
                <Upload size={14} /> Upload ảnh
              </span>
            </label>
            <button className="flex items-center gap-1.5 px-4 rounded-full text-sm font-medium text-[#0F172A]"
              style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.1)', height: 36, minWidth: 110 }}>
              <Camera size={14} /> Chụp ảnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 1: CCCD/CMND ──────────────────────────────────────────────────── */
function StepCCCD({ onNext }) {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [form, setForm] = useState({ soCCCD: '', hoTen: '', ngaySinh: '', ngayCap: '', ngayHetHan: '', diaChi: '' });
  const canContinue = scanned && form.soCCCD && form.hoTen && form.ngaySinh && form.ngayCap;
  const inp = 'w-full px-4 py-2 rounded-full bg-[#F3F3F5] border-2 border-transparent outline-none focus:border-[#1B83A1] text-sm text-[#64748B]';

  const handleImage = async (url) => {
    setImage(url);
    if (url) { 
      setScanning(true); 
      setScanned(false); 
      
      // Call OCR API
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "cccd.jpg", { type: "image/jpeg" });
        
        const formData = new FormData();
        formData.append('image', file);
        
        const ocrResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/customer/ocr/cccd`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (ocrResponse.ok) {
          const data = await ocrResponse.json();
          console.log('OCR CCCD data:', data);
          setForm({
            soCCCD: data.identityCard || '',
            hoTen: data.fullName || '',
            ngaySinh: data.dateOfBirth ? convertDateFormat(data.dateOfBirth) : '',
            ngayCap: '',
            ngayHetHan: data.identityCardExpiry ? convertDateFormat(data.identityCardExpiry) : '',
            diaChi: data.address || '',
            imageFile: file // Store the actual file
          });
        } else {
          console.error('OCR API error:', await ocrResponse.text());
        }
      } catch (error) {
        console.error('OCR error:', error);
      } finally {
        setScanning(false); 
        setScanned(true);
      }
    }
    else { setScanning(false); setScanned(false); }
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="flex flex-col w-full" style={{ gap: 48 }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl shrink-0"
          style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#2B7FFF 0%,#00B8DB 100%)' }}>
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172B]">Xác thực CCCD/CMND</h2>
          <p className="text-sm text-[#45556C]">Vui lòng upload ảnh Căn cước công dân hoặc Chứng minh nhân dân</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 pr-8">
        <UploadZone file={image} onFile={handleImage} uploadColor="#1B83A1" label="Chọn ảnh CCCD/CMND" />

        {scanning && (
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[#BEDBFF] bg-[#EFF6FF]">
            <div className="w-4 h-4 rounded-full border-2 border-[#1B83A1] border-t-transparent animate-spin shrink-0" />
            <p className="text-sm font-medium text-[#193CB8]">Hệ thống đang quét thông tin từ ảnh...</p>
          </div>
        )}

        {scanned && (
          <>
            <div className="flex items-start gap-3 rounded-2xl px-4 py-3 border"
              style={{ background: '#EFF6FF', borderColor: '#BEDBFF' }}>
              <Info size={18} className="text-[#155DFC] shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-[#193CB8]">Lưu ý: Thông tin bạn nhập phải khớp với thông tin trên CCCD/CMND</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Số CCCD/CMND *</label>
                <input className={inp} placeholder="079123456789" value={form.soCCCD} onChange={e => setForm({ ...form, soCCCD: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Họ và tên *</label>
                <input className={inp} placeholder="NGUYỄN VĂN AN" value={form.hoTen} onChange={e => setForm({ ...form, hoTen: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Ngày sinh *</label>
                <input type="date" className={inp} value={form.ngaySinh} onChange={e => setForm({ ...form, ngaySinh: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Ngày cấp *</label>
                <input type="date" className={inp} value={form.ngayCap} onChange={e => setForm({ ...form, ngayCap: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Ngày hết hạn</label>
                <input type="date" className={inp} value={form.ngayHetHan} onChange={e => setForm({ ...form, ngayHetHan: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><FileText size={14} /> Địa chỉ thường trú</label>
                <input className={inp} placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM" value={form.diaChi} onChange={e => setForm({ ...form, diaChi: e.target.value })} />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button onClick={() => canContinue && onNext({ image, ...form })}
            className="flex items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ background: 'linear-gradient(90deg,#1B83A1 0%,#3B82F6 100%)', width: 134, height: 36, opacity: canContinue ? 1 : 0.5, cursor: canContinue ? 'pointer' : 'default' }}>
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: GPLX ───────────────────────────────────────────────────────── */
function StepGPLX({ onNext, onBack }) {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [form, setForm] = useState({ soGPLX: '', hangGPLX: '', ngayCap: '', ngayHetHan: '' });
  const [isUnlimited, setIsUnlimited] = useState(false);
  const canContinue = scanned && form.soGPLX && (form.ngayHetHan || isUnlimited);
  const inp = 'w-full px-4 py-2 rounded-full bg-[#F3F3F5] border-2 border-transparent outline-none focus:border-[#F38230] text-sm text-[#64748B]';

  const handleImage = async (url) => {
    setImage(url);
    if (url) { 
      setScanning(true); 
      setScanned(false); 
      
      // Call OCR API
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "gplx.jpg", { type: "image/jpeg" });
        
        const formData = new FormData();
        formData.append('image', file);
        
        const ocrResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/customer/ocr/driver-license`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (ocrResponse.ok) {
          const data = await ocrResponse.json();
          console.log('OCR GPLX data:', data);
          
          // Check if license is unlimited based on class or OCR data
          const licenseClass = data.licenseClass || '';
          const isAClass = ['A1', 'A2', 'A3'].includes(licenseClass);
          const unlimited = data.isUnlimited === 'true' || isAClass;
          setIsUnlimited(unlimited);
          
          setForm({
            soGPLX: data.driverLicense || '',
            hangGPLX: licenseClass,
            ngayCap: data.issueDate ? convertDateFormat(data.issueDate) : '',
            ngayHetHan: unlimited ? 'Không thời hạn' : (data.expiryDate ? convertDateFormat(data.expiryDate) : '')
          });
        } else {
          console.error('OCR API error:', await ocrResponse.text());
        }
      } catch (error) {
        console.error('OCR error:', error);
      } finally {
        setScanning(false); 
        setScanned(true);
      }
    }
    else { setScanning(false); setScanned(false); }
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="flex flex-col w-full" style={{ gap: 48 }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl shrink-0"
          style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#FF6900 0%,#FB2C36 100%)' }}>
          <Car size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172B]">Xác thực GPLX</h2>
          <p className="text-sm text-[#45556C]">Vui lòng upload ảnh Giấy phép lái xe</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 pr-8">
        <UploadZone file={image} onFile={handleImage} uploadColor="#F38230" label="Chọn ảnh GPLX" />

        {scanning && (
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[#FFD6A8] bg-[#FFF7ED]">
            <div className="w-4 h-4 rounded-full border-2 border-[#F38230] border-t-transparent animate-spin shrink-0" />
            <p className="text-sm font-medium text-[#9F2D00]">Hệ thống đang quét thông tin từ ảnh...</p>
          </div>
        )}

        {scanned && (
          <>
            <div className="flex items-start gap-3 rounded-2xl px-4 py-3 border"
              style={{ background: '#FFF7ED', borderColor: '#FFD6A8' }}>
              <AlertCircle size={18} className="text-[#F38230] shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-[#9F2D00]">Quan trọng: GPLX của bạn phải còn hạn sử dụng và đủ hạng để lái xe bạn muốn thuê</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]"><Car size={14} /> Số GPLX *</label>
                <input className={inp} placeholder="012345678" value={form.soGPLX} onChange={e => setForm({ ...form, soGPLX: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0F172A]">Hạng GPLX</label>
                <select className="w-full px-4 py-2 rounded-full bg-white border-2 border-black/10 outline-none focus:border-[#F38230] text-sm text-[#64748B]"
                  value={form.hangGPLX} onChange={e => {
                    const hs = e.target.value;
                    const isAClass = ['A1', 'A2', 'A3'].includes(hs);
                    setIsUnlimited(isAClass);
                    setForm({ ...form, hangGPLX: hs, ngayHetHan: isAClass ? 'Không thời hạn' : (form.ngayHetHan === 'Không thời hạn' ? '' : form.ngayHetHan) });
                  }}>
                  <option value="">-- Chọn hạng --</option>
                  {['A1','A2','A3','B1','B2','C','D','E','F'].map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0F172A]">Ngày cấp</label>
                <input type="date" className={inp} value={form.ngayCap} onChange={e => setForm({ ...form, ngayCap: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]">
                  <AlertCircle size={14} /> Ngày hết hạn {!isUnlimited && '*'}
                </label>
                {isUnlimited ? (
                  <input 
                    type="text" 
                    className={inp + ' cursor-not-allowed'} 
                    value="Không thời hạn" 
                    disabled 
                    style={{ opacity: 0.7 }}
                  />
                ) : (
                  <input 
                    type="date" 
                    className={inp} 
                    value={form.ngayHetHan} 
                    onChange={e => setForm({ ...form, ngayHetHan: e.target.value })} 
                  />
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button onClick={onBack}
            className="flex items-center justify-center rounded-full text-sm font-medium text-[#0F172A]"
            style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.1)', height: 36, padding: '0 16px' }}>
            ← Quay lại
          </button>
          <button onClick={() => canContinue && onNext({ image, ...form })}
            className="flex items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ background: 'linear-gradient(90deg,#F38230 0%,#F6A05F 100%)', width: 134, height: 36, opacity: canContinue ? 1 : 0.5, cursor: canContinue ? 'pointer' : 'default' }}>
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Confirm ────────────────────────────────────────────────────── */
function StepConfirm({ cccd, gplx, onBack, onSubmit }) {
  const [agreed, setAgreed] = useState(false);
  const Row = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-[#62748E]">{label}</span>
      <span className="text-base font-medium text-[#0F172B]">{value || '—'}</span>
    </div>
  );
  const Section = ({ title, icon, color, children }) => (
    <div className="border-2 border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2" style={{ color }}>{icon}<h3 className="text-lg font-medium text-[#0F172B]">{title}</h3></div>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-5 w-full pr-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl shrink-0"
          style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#00C950 0%,#00BC7D 100%)' }}>
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172B]">Xác nhận thông tin</h2>
          <p className="text-sm text-[#45556C]">Kiểm tra lại thông tin trước khi gửi xác thực</p>
        </div>
      </div>

      <Section title="Thông tin CCCD/CMND" icon={<FileText size={18} />} color="#1B83A1">
        <div className="flex gap-4">
          {cccd.image && <img src={cccd.image} alt="cccd" className="w-32 h-20 object-cover rounded-xl shadow shrink-0" />}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
            <Row label="Số CCCD/CMND" value={cccd.soCCCD} />
            <Row label="Họ và tên" value={cccd.hoTen} />
            <Row label="Ngày sinh" value={cccd.ngaySinh} />
            <Row label="Địa chỉ" value={cccd.diaChi} />
          </div>
        </div>
      </Section>

      <Section title="Thông tin GPLX" icon={<Car size={18} />} color="#F38230">
        <div className="flex gap-4">
          {gplx.image && <img src={gplx.image} alt="gplx" className="w-32 h-20 object-cover rounded-xl shadow shrink-0" />}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
            <Row label="Số GPLX" value={gplx.soGPLX} />
            <Row label="Hạng GPLX" value={gplx.hangGPLX} />
            <Row label="Ngày hết hạn" value={gplx.ngayHetHan} />
          </div>
        </div>
      </Section>

      <div className="border-2 border-[#E2E8F0] rounded-2xl p-5"
        style={{ background: 'linear-gradient(90deg,#EFF6FF 0%,#FFF7ED 100%)' }}>
        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(!agreed)}>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-[#0D6FFF] border-[#0D6FFF]' : 'border-gray-300 bg-white'}`}>
            {agreed && <CheckCircle2 size={12} className="text-white" />}
          </div>
          <span className="text-sm font-medium text-[#314158] leading-relaxed">
            Tôi xác nhận rằng tất cả thông tin trên là chính xác và các giấy tờ được cung cấp là thật. Tôi hiểu rằng việc cung cấp thông tin sai lệch có thể dẫn đến việc tài khoản bị khóa và chịu trách nhiệm pháp lý theo quy định.
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2 rounded-full text-sm font-medium text-[#0F172A]"
          style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.1)' }}>← Quay lại</button>
        <button onClick={onSubmit} disabled={!agreed}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium text-white ${agreed ? '' : 'opacity-50 cursor-not-allowed'}`}
          style={{ background: 'linear-gradient(90deg,#00C950 0%,#00BC7D 100%)' }}>
          <ShieldCheck size={16} /> Gửi xác thực
        </button>
      </div>
    </div>
  );
}

/* ─── Processing ─────────────────────────────────────────────────────────── */
function StepProcessing() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8 text-center w-full">
      <div className="relative w-24 h-24">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#1B83A1 0%,#3B82F6 100%)' }}>
          <ShieldCheck size={40} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1B83A1] animate-spin" />
      </div>
      <div className="flex gap-2">
        {['#1B83A1','#3B82F6','#F38230'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-full animate-bounce" style={{ background: c, animationDelay: `${i*150}ms` }} />
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#0F172B]">Đang xử lý xác thực...</h2>
        <p className="text-[#45556C] mt-2">Hệ thống đang kiểm tra và so khớp thông tin của bạn</p>
      </div>
    </div>
  );
}

/* ─── Success ────────────────────────────────────────────────────────────── */
function StepSuccess({ onDone }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center w-full">
      <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg,#00C950 0%,#00BC7D 100%)' }}>
        <CheckCircle2 size={48} className="text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-semibold text-[#0F172B]">Xác thực thành công!</h2>
        <p className="text-[#45556C] mt-2 max-w-sm mx-auto">Tài khoản của bạn đã được xác thực. Bạn có thể bắt đầu thuê xe ngay.</p>
      </div>
      <span className="px-5 py-2 rounded-full text-sm font-medium text-[#008236]"
        style={{ background: '#DCFCE7', border: '1px solid #7BF1A8' }}>✓ Đã xác thực</span>
      <button onClick={onDone} className="mt-2 px-10 py-3 rounded-full text-white font-medium"
        style={{ background: 'linear-gradient(90deg,#1B83A1 0%,#3B82F6 100%)' }}>Về trang chủ</button>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function VerifyIdentity() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cccd, setCccd] = useState(null);
  const [gplx, setGplx] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleSubmit = async () => { 
    setStep('processing'); 
    
    try {
      const formData = new FormData();
      formData.append('identityCard', cccd.soCCCD);
      if (cccd.ngayCap) {
        formData.append('identityCardIssueDate', cccd.ngayCap);
      }
      if (cccd.ngayHetHan) {
        formData.append('identityCardExpiry', cccd.ngayHetHan);
      }
      if (cccd.diaChi) {
        formData.append('address', cccd.diaChi);
      }
      if (cccd.ngaySinh) {
        formData.append('dateOfBirth', cccd.ngaySinh);
      }
      
      formData.append('driverLicense', gplx.soGPLX);
      if (gplx.hangGPLX) {
        formData.append('driverLicenseClass', gplx.hangGPLX);
      }
      if (gplx.ngayCap) {
        formData.append('driverLicenseIssueDate', gplx.ngayCap);
      }
      if (gplx.ngayHetHan && gplx.ngayHetHan !== 'Không thời hạn') {
        formData.append('driverLicenseExpiry', gplx.ngayHetHan);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/customer/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setTimeout(() => setStep('success'), 2000);
      } else {
        try {
          const errorData = await response.json();
          setToast({ message: errorData.message || 'Xác thực thất bại', type: 'error' });
          if (errorData.step) {
            setStep(errorData.step);
          } else {
            setStep(3);
          }
        } catch (e) {
          setToast({ message: 'Lỗi không xác định từ server', type: 'error' });
          setStep(3);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setToast({ message: 'Lỗi kết nối đến server', type: 'error' });
      setStep(3);
    }
  };
  const isNumeric = typeof step === 'number';

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 50%,#F8FAFC 100%)' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0]"
        style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between px-8" style={{ height: 81 }}>
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img src="/images/logo.webp" alt="XeNow" className="h-14 object-contain"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <nav className="flex items-center gap-1 text-sm font-medium text-[#0A0A0A]">
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg hover:bg-gray-100">Trang chủ</button>
            <button onClick={() => navigate('/my-bookings')} className="px-4 py-2 rounded-lg hover:bg-gray-100">Booking của tôi</button>
            <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg hover:bg-gray-100">Tài khoản</button>
            <button onClick={() => navigate('/admin')} className="px-4 py-2 rounded-lg bg-white border border-black/10 hover:bg-gray-50 ml-1">Admin Panel</button>
          </nav>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-8 py-12 max-w-4xl mx-auto w-full">

        {/* Title badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3"
            style={{ boxShadow: '0 4px 6px -4px rgba(0,0,0,0.1),0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <ShieldCheck size={22} className="text-[#1B83A1]" />
            <span className="text-2xl font-bold text-[#0F172B]">Xác thực tài khoản</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-base text-[#45556C] mb-8">
          Hoàn thành xác thực để bảo vệ tài khoản và có thể thuê xe
        </p>

        {/* Step indicator */}
        {isNumeric && <div className="mb-8"><StepIndicator step={step} /></div>}

        {/* Card */}
        <div className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1)', padding: '32px 0 32px 32px' }}>
          {step === 1 && <StepCCCD onNext={d => { setCccd(d); setStep(2); }} />}
          {step === 2 && <StepGPLX onNext={d => { setGplx(d); setStep(3); }} onBack={() => setStep(1)} />}
          {step === 3 && <StepConfirm cccd={cccd} gplx={gplx} onBack={() => setStep(2)} onSubmit={handleSubmit} />}
          {step === 'processing' && <StepProcessing />}
          {step === 'success' && <StepSuccess onDone={() => navigate('/')} />}
        </div>

        {step !== 'success' && (
          <p className="text-center text-sm text-[#62748E] mt-6">
            Cần trợ giúp? Liên hệ support@xenow.vn
          </p>
        )}
      </main>
    </div>
  );
}
