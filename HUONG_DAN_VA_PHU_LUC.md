# Web Ngọc Yến — thêm vào giỏ hàng và đơn hàng đã đặt

## 1. Ghép vào bài đang làm

1. Giải nén `NgocYen_gio_hang_va_don_hang.zip`.
2. Chép các file HTML và hai thư mục `css`, `js` vào cùng thư mục bài. Thay các file trùng tên bằng bản mới. Tên trang dùng trong liên kết là `trangchu.html`, `cart.html`, `checkout.html`, `order-success.html`, `orders.html`; không có hậu tố `(3)`.
3. Giữ thư mục ảnh `NgocYen_image` của nhóm ở cùng cấp với các file HTML. Tệp đính kèm ban đầu không có thư mục ảnh, nên gói sửa không kèm ảnh gốc.
4. Mở `trangchu.html` bằng Live Server trong VS Code. Tất cả các trang phải dùng cùng địa chỉ và cổng để đọc chung dữ liệu.

## 2. Những chức năng đã bổ sung

- Có nút **Thêm vào giỏ hàng** ở ba sản phẩm trên trang chủ.
- Sản phẩm đã có trong giỏ sẽ tăng số lượng khi thêm tiếp; không tạo thêm dòng trùng.
- Menu **Giỏ Hàng (n)** hiển thị tổng số lượng và cập nhật khi quay lại trang hoặc thay đổi giỏ ở tab khác.
- Giỏ hàng bắt đầu trống, giữ các sản phẩm đã lưu, hỗ trợ tăng/giảm số lượng và xóa sản phẩm. Giỏ trống không cho đặt hàng.
- Trang thanh toán lấy tên, ảnh, giá và số lượng từ giỏ hàng; kiểm tra thông tin nhận hàng trước khi lưu.
- Đặt hàng thành công sẽ thêm một đơn mới vào lịch sử rồi làm trống giỏ. Những đơn cũ được giữ nguyên.
- Trang **Đơn hàng đã đặt** (`orders.html`) hiển thị mã đơn, thời gian đặt, sản phẩm, số lượng, tổng tiền và trạng thái. Bấm **Xem chi tiết đơn hàng** để xem người nhận, điện thoại, địa chỉ, vận chuyển, thanh toán, giảm giá và ghi chú.
- Có liên kết đến lịch sử trên trang chủ, giỏ hàng, thanh toán và xác nhận. Tải lại trang không tạo thêm đơn.

## 3. Các file và phụ lục

| Phụ lục | Nội dung | File |
| --- | --- | --- |
| HTML | Trang chủ, giỏ hàng, thanh toán, xác nhận và lịch sử | `trangchu.html`, `cart.html`, `checkout.html`, `order-success.html`, `orders.html` |
| CSS | Giao diện xanh ngọc – vàng, form, thông báo, danh sách đơn và bố cục điện thoại | CSS trong trang chủ/giỏ và `css/checkout.css` |
| JavaScript | Thêm hàng, số lượng, tính tiền, kiểm tra form, lưu nhiều đơn, đọc lịch sử | JS trong trang chủ/giỏ, `js/shop.js`, `js/checkout.js`, `js/order-success.js`, `js/orders.js` |

Bản gửi ban đầu không kèm `css/checkout.css` và các file JavaScript được HTML gọi tới. Gói này bổ sung các file đó để luồng thanh toán và lịch sử chạy cùng nhau. Không thêm lại `ket-noi-cart.js`; nút thanh toán đã được nối trong `cart.html`.

## 4. Dữ liệu và các mức giá

| Sản phẩm | Mã `data-product-id` | Giá |
| --- | --- | --- |
| Vòng bản Ngọc hòa điền - Hoàng Khẩu Mật | 1 | 3.200.000 ₫ — lấy từ file giỏ gốc |
| Vòng tay ngọc lam băng | 2 | 1.500.000 ₫ — lấy từ file giỏ gốc |
| Nhẫn bạch ngọc hòa điền | 3 | 850.000 ₫ — giá minh họa vì file gốc chưa có giá |

Đổi giá bằng thuộc tính `data-price` trên thẻ sản phẩm trong `trangchu.html`. Giá hiển thị được cập nhật từ thuộc tính này. Khi đã có giá nhẫn chính thức, sửa `data-price` và bỏ `data-demo-price="true"`. Các sản phẩm đã thêm trước đó và các đơn đã đặt giữ giá lúc lưu; xóa sản phẩm cũ khỏi giỏ rồi thêm lại để thử giá mới.

Giao tiêu chuẩn 50.000 ₫, miễn phí khi tạm tính tiền hàng đạt 2.000.000 ₫ trước giảm giá. Giao nhanh 80.000 ₫. Mã minh họa `NGOCYEN10` giảm 10% tiền hàng, không giảm phí giao. Các mức này giữ theo hướng dẫn ban đầu.

## 5. Cách lưu đơn và giới hạn bài thiết kế

- `ngocyen_cart`: mảng sản phẩm trong giỏ, lưu bằng `localStorage`.
- `ngocyen_orders`: mảng các đơn đã đặt, mỗi đơn gồm mã, ngày đặt, người nhận, bản sao sản phẩm, các khoản tiền và phương thức giao/thanh toán.
- Đơn được lưu trên cùng trình duyệt và cùng nguồn website. Đổi thiết bị, đổi cổng Live Server, dùng trình duyệt khác hoặc xóa dữ liệu duyệt web sẽ không thấy cùng lịch sử.
- Đây là mô phỏng cho bài thiết kế: chưa có máy chủ nhận đơn, tài khoản, email, giao hàng hay cổng thanh toán thật. Chọn COD/chuyển khoản/thẻ chỉ ghi nhận phương thức. Trạng thái đơn là **Chờ xác nhận**, thanh toán là **Chưa thanh toán**.
- Nếu lưu lịch sử không thành công, trang giữ nguyên giỏ và hiển thị thông báo; không báo đặt hàng thành công.
- Trang giỏ hàng vẫn dùng Tailwind qua CDN theo file gốc, nên cần Internet để nạp đầy đủ kiểu dáng của trang này.

## 6. Thử nhanh

1. Mở trang chủ, bấm thêm vòng hạt hai lần và vòng bản một lần. Giỏ hiển thị tổng 3 sản phẩm, gồm 2 dòng.
2. Mở giỏ: tạm tính 6.200.000 ₫, giao tiêu chuẩn miễn phí. Đổi số lượng hoặc xóa một dòng rồi tải lại để kiểm tra.
3. Sang thanh toán; thử để trống tên, nhập số điện thoại sai hoặc chỉ nhập dấu cách để kiểm tra form.
4. Với giỏ 6.200.000 ₫, chọn giao nhanh và mã `NGOCYEN10`: giảm 620.000 ₫, phí giao 80.000 ₫, tổng 5.660.000 ₫.
5. Nhập đủ thông tin và đặt hàng. Trang xác nhận hiện mã đơn, đúng người nhận và sản phẩm; giỏ trở về 0.
6. Mở **Đơn hàng đã đặt**, xem chi tiết. Đặt thêm một đơn khác rồi quay lại: cả hai đơn còn trong danh sách, đơn mới ở trên.
7. Tải lại trang lịch sử hoặc xác nhận: đơn vẫn còn và không bị nhân đôi.
