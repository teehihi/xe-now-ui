export async function generateContractPdf(booking, vehicle, customer) {
  const fmt = (d) => {
    if (!d) return '...';
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
  };
  const fmtYear = (d) => d ? new Date(d).getFullYear() : '...';
  const fmtMoney = (n) => (n && Number(n) > 0) ? Number(n).toLocaleString('vi-VN') : '...';

  const today = new Date();
  const contractNo = booking.bookingId || '...';
  const customerName = customer?.fullName || booking?.customerName || '...';
  const customerDob = customer?.dateOfBirth ? fmtYear(customer.dateOfBirth) : '...';
  const customerCccd = customer?.identityCard || customer?.cccd || '...';
  const customerCccdIssueDate = customer?.identityCardIssueDate ? fmt(customer.identityCardIssueDate) : '...';
  const customerAddress = customer?.address || '...';
  const vehicleName = vehicle?.name || booking?.vehicleModel || '...';
  const vehiclePlate = vehicle?.licensePlate || booking?.vehiclePlate || '...';
  const vehicleYear = vehicle?.year || vehicle?.manufactureYear || booking?.vehicleYear || '...';
  const vehicleSeats = vehicle?.seats || booking?.vehicleSeats || '...';
  const vehicleType = vehicle?.type || booking?.vehicleType || 'xe';
  const pricePerDay = fmtMoney(vehicle?.pricePerDay || vehicle?.dailyRate || booking?.pricePerDay);
  const startDate = fmt(booking?.startDate);
  const endDate = fmt(booking?.endDate);
  const totalPrice = fmtMoney(booking?.totalPrice);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Hợp đồng thuê xe số ${contractNo}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.6; color: #000; padding: 20mm 20mm 20mm 25mm; }
  .center { text-align: center; }
  p { margin-bottom: 4px; }
  .section-title { font-weight: bold; font-size: 13pt; margin: 10px 0 3px; }
  .mb6 { margin-bottom: 8px; }
  table.sig { width: 100%; border-collapse: collapse; margin-top: 30px; }
  table.sig td { width: 50%; text-align: center; padding: 8px; border: 1px solid #000; vertical-align: top; }
  .sig-sub { font-style: italic; font-size: 11pt; margin-bottom: 45px; }
</style>
</head>
<body>
<p class="center" style="font-weight:bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
<p class="center" style="font-weight:bold">Độc Lập – Tự Do – Hạnh Phúc</p>
<p class="center">----------oOo----------</p>
<p class="center" style="font-size:16pt;font-weight:bold;margin:10px 0 3px">HỢP ĐỒNG THUÊ XE</p>
<p class="center mb6">Số: ${contractNo} – ${today.getFullYear()}/HĐTX</p>
<p>- Căn cứ Bộ Luật Dân sự 2015;</p>
<p>- Căn cứ Luật thương mại 2005;</p>
<p class="mb6">- Căn cứ vào nhu cầu và khả năng cung ứng của các bên dưới đây.</p>
<p class="mb6">Hôm nay, ngày ${String(today.getDate()).padStart(2,'0')} tháng ${String(today.getMonth()+1).padStart(2,'0')} năm ${today.getFullYear()}, chúng tôi gồm:</p>
<p><strong>BÊN CHO THUÊ: CÔNG TY TNHH Chuyến Xe Tức Thời (XeNow)</strong> <em>(Sau đây gọi tắt là Bên A)</em></p>
<p>- Địa chỉ: 01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM</p>
<p>- Đại diện: Nguyễn Nhật Thiên &nbsp;&nbsp; Chức vụ: Giám đốc</p>
<p class="mb6">- Mã số thuế: xxxxxxxx</p>
<p><strong>BÊN THUÊ</strong> <em>(Sau đây gọi tắt là Bên B)</em></p>
<p>Ông/bà: <strong>${customerName}</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sinh năm: <strong>${customerDob}</strong></p>
<p>CMND/CCCD/Hộ chiếu số: <strong>${customerCccd}</strong> do <strong>Bộ Công An</strong> cấp ngày <strong>${customerCccdIssueDate}</strong></p>
<p class="mb6">Hộ khẩu thường trú tại: <strong>${customerAddress}</strong></p>
<p class="mb6">Hai bên đã thỏa thuận và thống nhất ký kết Hợp đồng thuê xe với những điều khoản cụ thể như sau:</p>
<p class="section-title">ĐIỀU 1: NỘI DUNG HỢP ĐỒNG</p>
<p>Bên A đồng ý cho bên B thuê một <strong>${vehicleType}</strong> <strong>${vehicleSeats}</strong> chỗ ngồi, không bao gồm cả lái xe trong thời gian cho thuê.</p>
<p class="mb6">+ Xe <strong>${vehicleName}</strong> sản xuất năm <strong>${vehicleYear}</strong>, biển số kiểm soát <strong>${vehiclePlate}</strong></p>
<p class="section-title">ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG, PHƯƠNG THỨC THANH TOÁN:</p>
<p>- Giá thuê xe là: <strong>${pricePerDay}</strong> đồng/ngày (Giá trên chưa bao gồm thuế GTGT)</p>
<p class="mb6">- Tổng giá trị hợp đồng: <strong>${totalPrice}</strong> đồng</p>
<p class="section-title">ĐIỀU 3: TRÁCH NHIỆM CỦA CÁC BÊN</p>
<p><strong>3.1. Trách nhiệm của bên A:</strong></p>
<p>- Giao xe và toàn bộ giấy tờ liên quan đến xe ngay sau khi Hợp đồng có hiệu lực. Giấy tờ liên quan đến xe gồm: Giấy đăng ký xe, giấy kiểm định, giấy bảo hiểm xe.</p>
<p>- Chịu trách nhiệm pháp lý về nguồn gốc và quyền sở hữu của xe.</p>
<p>- Mua bảo hiểm xe và đăng kiểm xe cho các lần kế tiếp trong thời hạn hiệu lực của Hợp đồng.</p>
<p>- Bảo dưỡng xe theo định kỳ, chi trả phí bảo dưỡng.</p>
<p class="mb6">- Xuất hóa đơn thuê xe.</p>
<p><strong>3.2. Trách nhiệm, quyền hạn của bên B:</strong></p>
<p>- Thanh toán tiền thuê xe cho Bên A đúng hạn.</p>
<p>- Bên B được toàn quyền sử dụng xe do Bên A giao (theo điều 1), kể cả giao xe cho lái xe khác sử dụng trong thời gian thuê.</p>
<p class="mb6">- Chịu toàn bộ chi phí xăng khi sử dụng xe.</p>
<p class="section-title">ĐIỀU 4: HIỆU LỰC HỢP ĐỒNG</p>
<p class="mb6">- Hợp đồng có giá trị kể từ ngày <strong>${startDate}</strong> đến hết ngày <strong>${endDate}</strong>.</p>
<p class="section-title">ĐIỀU 5: ĐIỀU KHOẢN CHUNG</p>
<p>- Trong quá trình thực hiện hợp đồng, nếu có đề nghị điều chỉnh thì phải thông báo cho nhau bằng văn bản để cùng bàn bạc giải quyết.</p>
<p>- Hai bên cam kết thi hành đúng các điều khoản của hợp đồng, không bên nào tự ý đơn phương sửa đổi, đình chỉ hoặc hủy bỏ hợp đồng. Mọi sự vi phạm phải được xử lý theo pháp luật. Trường hợp có tranh chấp mà hai bên không tự giải quyết được, sẽ do Tòa Án Nhân Dân Thành phố Hồ Chí Minh xử.</p>
<p>- Hợp đồng này có hiệu lực từ ngày ký và coi như được thanh lý sau khi hai bên thực hiện xong nghĩa vụ của mình và không còn bất kỳ khiếu nại nào.</p>
<p class="mb6">Hợp đồng được lập thành 04 (bốn) bản có giá trị pháp lý như nhau, Bên A giữ 02 (hai) bản. Bên B giữ 02 (hai) bản.</p>
<table class="sig">
  <tr>
    <td>
      <p style="font-weight:bold">ĐẠI DIỆN BÊN A</p>
      <p class="sig-sub">ký và ghi rõ họ tên</p>
      <p><strong>Nguyễn Nhật Thiên</strong></p>
    </td>
    <td>
      <p style="font-weight:bold">ĐẠI DIỆN BÊN B</p>
      <p class="sig-sub">ký và ghi rõ họ tên</p>
      <p><strong>${customerName}</strong></p>
    </td>
  </tr>
</table>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
  // Auto trigger print after load
  win.onload = () => win.print();
}
