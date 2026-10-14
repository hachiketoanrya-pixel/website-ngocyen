// PHỤ LỤC 3 - JAVASCRIPT HIỂN THỊ TRANG XÁC NHẬN ĐƠN HÀNG
(function () {
    try {
        const raw = sessionStorage.getItem('ngocyen_last_order');
        if (!raw) return;
        const order = JSON.parse(raw);

        document.getElementById('success-code').textContent = order.code || 'NY-MAU-001';
        document.getElementById('success-name').textContent = order.name || '';
        document.getElementById('success-phone').textContent = order.phone || '';
        document.getElementById('success-address').textContent = order.address || '';
        document.getElementById('success-shipping').textContent = order.shipping || '';
        document.getElementById('success-payment').textContent = order.payment || '';
        document.getElementById('payment-status').textContent = order.paymentStatus || 'Chưa thanh toán';

        if (order.note) {
            document.getElementById('success-note-box').hidden = false;
            document.getElementById('success-note').textContent = order.note;
        }

        if (Array.isArray(order.items) && order.items.length > 0) {
            const listEl = document.getElementById('success-items-list');
            listEl.innerHTML = `<p class="detail-label" style="margin-bottom:8px;">Sản phẩm đã đặt (${order.items.length} loại)</p>` +
                order.items.map(item => `
                    <div class="price-row" style="font-size:14px;">
                        <span>• ${item.name} (x${item.quantity})</span>
                        <strong>${(item.price * item.quantity).toLocaleString('vi-VN')} ₫</strong>
                    </div>
                `).join('');
        }

        document.getElementById('success-subtotal').textContent = order.subtotal || '0 ₫';
        document.getElementById('success-fee').textContent = order.fee || 'Miễn phí';
        document.getElementById('success-discount').textContent = order.discount || '—';
        document.getElementById('success-total').textContent = order.total || '0 ₫';

        const demoMsg = document.getElementById('demo-message');
        if (demoMsg) {
            demoMsg.textContent = `Đơn hàng được khởi tạo lúc ${order.createdAt || 'hôm nay'}. Bạn có thể dùng mã ${order.code} để tra cứu bảo hành tại Trang chủ.`;
        }
    } catch (e) {}

    document.getElementById('copy-code-btn')?.addEventListener('click', function () {
        const code = document.getElementById('success-code').textContent;
        navigator.clipboard?.writeText(code);
        this.textContent = '✓ Đã chép';
    });
})();