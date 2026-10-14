// Đọc lịch sử; đơn mới nhất nằm trên cùng. Xem trang này không sửa dữ liệu.
function renderOrders() {
    const list = document.getElementById('orders-list');
    const count = document.getElementById('orders-count');
    try {
        const orders = Shop.readOrders().slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        count.textContent = orders.length ? 'Bạn đã đặt ' + orders.length + ' đơn hàng.' : 'Các đơn bạn đặt sẽ xuất hiện tại đây.';
        if (!orders.length) {
            list.innerHTML = '<section class="box empty-state"><div class="empty-symbol" aria-hidden="true">◇</div><h2>Bạn chưa có đơn hàng nào</h2><p>Chọn một món trang sức yêu thích để bắt đầu nhé.</p><a class="primary-button" href="trangchu.html#danh-muc">Khám phá sản phẩm →</a></section>';
            return;
        }
        list.innerHTML = orders.map(order => {
            const customer = order.customer;
            return `<article class="box order-card" data-order-id="${Shop.escape(order.id)}">
                <div class="order-card-heading">
                    <div><h2>Đơn ${Shop.escape(order.id)}</h2><p>Đặt lúc <time datetime="${Shop.escape(order.createdAt)}">${Shop.date(order.createdAt)}</time></p></div>
                    <span class="status-badge">${Shop.escape(order.status || 'Chờ xác nhận')}</span>
                </div>
                <div class="ordered-products">${Shop.productsHTML(order.items)}</div>
                <div class="order-card-total"><span>Tổng thanh toán</span><strong>${Shop.money(order.total)}</strong></div>
                <details class="order-details">
                    <summary>Xem chi tiết đơn hàng</summary>
                    <div class="success-details">
                        <div><p class="detail-label">Người nhận</p><p class="detail-value">${Shop.escape(customer.name)}</p><p>${Shop.escape(customer.phone)}</p>${customer.email ? `<p>${Shop.escape(customer.email)}</p>` : ''}</div>
                        <div><p class="detail-label">Địa chỉ nhận hàng</p><p class="detail-value">${Shop.escape(Shop.address(customer))}</p></div>
                        <div><p class="detail-label">Vận chuyển</p><p>${Shop.shippingLabel(order.shippingMethod)}</p></div>
                        <div><p class="detail-label">Thanh toán</p><p>${Shop.paymentLabel(order.paymentMethod)}</p><span class="payment-status">${Shop.escape(order.paymentStatus || 'Chưa thanh toán')}</span></div>
                        ${customer.note ? `<div><p class="detail-label">Ghi chú</p><p>${Shop.escape(customer.note)}</p></div>` : ''}
                    </div>
                    <hr>
                    <div class="price-row"><span>Tạm tính</span><span>${Shop.money(order.subtotal)}</span></div>
                    <div class="price-row"><span>Phí vận chuyển</span><span>${Shop.money(order.shippingFee)}</span></div>
                    <div class="price-row"><span>Giảm giá${order.coupon ? ' (' + Shop.escape(order.coupon) + ')' : ''}</span><span>${order.discount ? '−' + Shop.money(order.discount) : '—'}</span></div>
                </details>
            </article>`;
        }).join('');
    } catch (error) {
        count.textContent = 'Chưa đọc được lịch sử đơn hàng.';
        list.innerHTML = '<section class="box"><p role="alert">' + Shop.escape(error.message) + '</p></section>';
    }
}
renderOrders();
window.addEventListener('pageshow', renderOrders);
window.addEventListener('storage', function (event) {
    if (event.key === Shop.ordersKey || event.key === null) renderOrders();
});
