// Các hàm dùng chung cho thanh toán, xác nhận và lịch sử đơn hàng.
// Code chạy trên trình duyệt, không cần cài thư viện JavaScript.
const Shop = {
    cartKey: 'ngocyen_cart',
    ordersKey: 'ngocyen_orders',

    money(value) {
        return Number(value).toLocaleString('vi-VN') + ' ₫';
    },

    // Đưa dữ liệu vào HTML dưới dạng chữ để không chạy các thẻ lạ.
    escape(value) {
        return String(value == null ? '' : value)
            .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    },

    validItem(item) {
        return item && Number.isSafeInteger(item.id) && typeof item.name === 'string' &&
            Number.isFinite(item.price) && item.price >= 0 &&
            Number.isSafeInteger(item.quantity) && item.quantity > 0;
    },

    readCart() {
        const saved = localStorage.getItem(this.cartKey);
        if (!saved) return [];
        let items;
        try { items = JSON.parse(saved); } catch (error) { return []; }
        if (!Array.isArray(items)) return [];
        return items.filter(item => this.validItem(item)).map(item => ({
            id: item.id, name: item.name, price: item.price, quantity: item.quantity,
            description: String(item.description || ''), image: String(item.image || '')
        }));
    },

    // Không tự ghi đè nếu lịch sử cũ bị lỗi: giữ nguyên dữ liệu để có thể kiểm tra.
    readOrders() {
        const saved = localStorage.getItem(this.ordersKey);
        if (!saved) return [];
        let orders;
        try { orders = JSON.parse(saved); } catch (error) {
            throw new Error('Chưa đọc được lịch sử đơn hàng. Dữ liệu cũ vẫn được giữ nguyên.');
        }
        const valid = Array.isArray(orders) && orders.every(order =>
            order && typeof order.id === 'string' &&
            Number.isFinite(Date.parse(order.createdAt)) &&
            order.customer && typeof order.customer.name === 'string' &&
            Array.isArray(order.items) && order.items.length > 0 &&
            order.items.every(item => this.validItem(item)) &&
            ['subtotal', 'shippingFee', 'discount', 'total'].every(key =>
                Number.isFinite(order[key]) && order[key] >= 0)
        );
        if (!valid) throw new Error('Lịch sử đơn hàng chưa đúng định dạng. Dữ liệu cũ vẫn được giữ nguyên.');
        return orders;
    },

    paymentLabel(value) {
        return { cod: 'Thanh toán khi nhận hàng (COD)', bank: 'Chuyển khoản ngân hàng', card: 'Thẻ ngân hàng' }[value] || 'Chưa chọn';
    },

    shippingLabel(value) {
        return value === 'express' ? 'Giao nhanh · 1–2 ngày' : 'Giao tiêu chuẩn · 3–5 ngày';
    },

    address(customer) {
        return [customer.address, customer.ward, customer.city].filter(Boolean).join(', ');
    },

    date(value) {
        return new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    },

    // Ảnh dùng đúng thư mục NgocYen_image; thiếu ảnh thì hiện hình vòng bằng CSS.
    productsHTML(items) {
        return items.map(item => {
            let path = String(item.image || '').replaceAll('\\', '/');
            const position = path.indexOf('NgocYen_image/');
            path = position >= 0 ? './' + path.slice(position) : '';
            const image = path ? `<img src="${this.escape(path)}" alt="${this.escape(item.name)}" onerror="this.hidden=true">` : '';
            return `<div class="product">
                <div class="product-photo ${item.id === 1 ? 'photo-amber' : 'photo-jade'}">${image}</div>
                <div class="product-info"><h3>${this.escape(item.name)}</h3>
                    <p>${this.escape(item.description)}</p>
                    <p>SL: ${item.quantity} × ${this.money(item.price)}</p>
                    <strong>${this.money(item.price * item.quantity)}</strong>
                </div>
            </div>`;
        }).join('');
    }
};
