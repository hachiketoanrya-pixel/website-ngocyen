// PHỤ LỤC 3 - JAVASCRIPT XỬ LÝ TRANG THANH TOÁN NÂNG CẤP
(function () {
    const FREE_SHIPPING_LIMIT = 2000000;
    const STANDARD_FEE = 50000;
    const EXPRESS_FEE = 80000;

    // Danh sách mã giảm giá đa tầng
    const COUPONS = {
        'NGOCYEN10': { type: 'percent', value: 0.10, desc: 'Giảm 10% giá trị sản phẩm' },
        'VIP500K': { type: 'fixed', value: 500000, minOrder: 4000000, desc: 'Giảm 500.000 ₫ cho đơn từ 4 triệu' },
        'FREESHIP': { type: 'freeship', value: 0, desc: 'Miễn phí vận chuyển cho mọi hình thức giao' }
    };

    let activeCouponCode = '';
    let cartItems = [
        {
            id: 1,
            name: "Vòng bản Ngọc hòa điền - Hoàng Khẩu Mật",
            description: "Ngọc thiên nhiên A-grade, size 56.",
            price: 3200000,
            quantity: 1,
            image: "./NgocYen_image/Vòng bản/Ngọc hòa điền - Hoàng Khẩu Mật/2.jpg"
        },
        {
            id: 2,
            name: "Vòng tay ngọc lam băng",
            description: "Thu hút may mắn và tài lộc, size 8 li.",
            price: 1500000,
            quantity: 1,
            image: "./NgocYen_image/Vòng hạt/ngọc lam băng/vong-tay-bang-lam-ngoc-7-8-ly-4.webp"
        }
    ];

    const formatMoney = (n) => n.toLocaleString('vi-VN') + ' ₫';

    function loadCartFromStorage() {
        try {
            const raw = localStorage.getItem('ngocyen_cart');
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                cartItems = parsed;
            }
        } catch (e) {}
    }

    function renderOrderProducts() {
        const container = document.getElementById('order-products');
        if (!container) return;

        container.innerHTML = cartItems.map((item, idx) => {
            const photoClass = idx % 2 === 0 ? 'photo-amber' : 'photo-jade';
            return `
                <div class="product">
                    <div class="product-photo ${photoClass}" role="img" aria-label="${item.name}"></div>
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.description || 'Trang sức ngọc tự nhiên'}</p>
                        <p>SL: ${item.quantity}</p>
                        <strong>${formatMoney(item.price * item.quantity)}</strong>
                    </div>
                </div>
            `;
        }).join('');
    }

    function calculateTotals() {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingRadio = document.querySelector('input[name="shipping"]:checked');
        const shippingMethod = shippingRadio ? shippingRadio.value : 'standard';

        let standardFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : STANDARD_FEE;
        let shippingFee = shippingMethod === 'express' ? EXPRESS_FEE : standardFee;

        let discount = 0;
        if (activeCouponCode && COUPONS[activeCouponCode]) {
            const c = COUPONS[activeCouponCode];
            if (c.type === 'percent') {
                discount = Math.round(subtotal * c.value);
            } else if (c.type === 'fixed' && subtotal >= (c.minOrder || 0)) {
                discount = c.value;
            } else if (c.type === 'freeship') {
                shippingFee = 0;
            }
        }

        const total = Math.max(0, subtotal - discount + shippingFee);

        document.getElementById('standard-fee').textContent = standardFee === 0 ? 'Miễn phí' : formatMoney(standardFee);
        document.getElementById('subtotal').textContent = formatMoney(subtotal);
        document.getElementById('shipping-fee').textContent = shippingFee === 0 ? 'Miễn phí' : formatMoney(shippingFee);
        document.getElementById('discount').textContent = discount > 0 ? '-' + formatMoney(discount) : (activeCouponCode === 'FREESHIP' ? 'Miễn phí ship' : '—');
        document.getElementById('total').textContent = formatMoney(total);

        // Cập nhật mã QR động theo số tiền thực tế
        const qrImg = document.getElementById('vietqr-img');
        if (qrImg) {
            qrImg.src = `https://img.vietqr.io/image/MB-0909123456-compact2.png?amount=${total}&addInfo=NGOCYEN%20THANHTOAN`;
        }

        return { subtotal, shippingFee, discount, total, shippingMethod };
    }

    function applyCoupon(codeInput) {
        const code = (codeInput || document.getElementById('coupon').value).trim().toUpperCase();
        const msgEl = document.getElementById('coupon-message');
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (!code || !COUPONS[code]) {
            activeCouponCode = '';
            msgEl.textContent = 'Mã giảm giá không hợp lệ. Hãy thử NGOCYEN10, VIP500K hoặc FREESHIP.';
            msgEl.style.color = '#b91c1c';
            calculateTotals();
            return;
        }

        const coupon = COUPONS[code];
        if (coupon.minOrder && subtotal < coupon.minOrder) {
            activeCouponCode = '';
            msgEl.textContent = `Mã ${code} chỉ áp dụng cho đơn từ ${formatMoney(coupon.minOrder)}.`;
            msgEl.style.color = '#b91c1c';
            calculateTotals();
            return;
        }

        activeCouponCode = code;
        document.getElementById('coupon').value = code;
        msgEl.textContent = `✓ Đã áp dụng mã ${code}: ${coupon.desc}`;
        msgEl.style.color = '#0d3b2e';
        calculateTotals();
    }

    function updatePaymentUI() {
        const payment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
        const qrBox = document.getElementById('bank-qr-box');
        const cardBox = document.getElementById('card-input-box');
        if (qrBox) qrBox.style.display = payment === 'bank' ? 'block' : 'none';
        if (cardBox) cardBox.style.display = payment === 'card' ? 'block' : 'none';
    }

    // Lưu nháp thông tin form để tải lại trang không bị mất chữ
    function setupDraftAutoSave() {
        const fields = ['full-name', 'phone', 'email', 'city', 'ward', 'address', 'note'];
        try {
            const draft = JSON.parse(localStorage.getItem('ngocyen_checkout_draft') || '{}');
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el && draft[id]) el.value = draft[id];
                if (el) {
                    el.addEventListener('input', () => {
                        draft[id] = el.value;
                        localStorage.setItem('ngocyen_checkout_draft', JSON.stringify(draft));
                    });
                }
            });
        } catch (e) {}
    }

    function handlePlaceOrder(event) {
        event.preventDefault();
        const fullName = document.getElementById('full-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const city = document.getElementById('city').value.trim();
        const ward = document.getElementById('ward').value.trim();
        const address = document.getElementById('address').value.trim();
        const note = document.getElementById('note').value.trim();
        const giftWrap = document.getElementById('gift-wrap')?.checked || false;
        const formMsg = document.getElementById('form-message');

        if (!fullName || !phone || !city || !ward || !address) {
            formMsg.textContent = 'Vui lòng điền đầy đủ các thông tin bắt buộc (*), không chỉ nhập khoảng trắng.';
            formMsg.style.color = '#b91c1c';
            return;
        }

        const totals = calculateTotals();
        const paymentVal = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
        const paymentLabels = {
            cod: 'Thanh toán khi nhận hàng (COD)',
            bank: 'Chuyển khoản ngân hàng (VietQR)',
            card: 'Thẻ ngân hàng (Napas / Quốc tế)'
        };

        const orderCode = 'NY-' + Math.floor(100000 + Math.random() * 900000);
        const orderData = {
            code: orderCode,
            createdAt: new Date().toLocaleString('vi-VN'),
            name: fullName,
            phone: phone,
            email: email,
            address: `${address}, ${ward}, ${city}`,
            shipping: totals.shippingMethod === 'express' ? 'Giao hỏa tốc VIP · 1–2 ngày' : 'Giao tiêu chuẩn · 3–5 ngày',
            payment: paymentLabels[paymentVal],
            paymentStatus: paymentVal === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chờ xác nhận giao dịch',
            note: (giftWrap ? '[🎁 Đóng gói Hộp quà Nhung Đỏ] ' : '') + note,
            subtotal: formatMoney(totals.subtotal),
            fee: totals.shippingFee === 0 ? 'Miễn phí' : formatMoney(totals.shippingFee),
            discount: totals.discount > 0 ? '-' + formatMoney(totals.discount) : '—',
            total: formatMoney(totals.total),
            items: cartItems
        };

        try {
            sessionStorage.setItem('ngocyen_last_order', JSON.stringify(orderData));
            // Lưu vào lịch sử đơn hàng để tra cứu bảo hành ở Trang chủ
            const history = JSON.parse(localStorage.getItem('ngocyen_orders') || '[]');
            history.unshift(orderData);
            localStorage.setItem('ngocyen_orders', JSON.stringify(history));
            // Xóa giỏ hàng và bản nháp sau khi đặt thành công
            localStorage.setItem('ngocyen_cart', JSON.stringify([]));
            localStorage.removeItem('ngocyen_checkout_draft');
        } catch (e) {}

        window.location.href = 'order-success.html';
    }

    loadCartFromStorage();
    renderOrderProducts();
    calculateTotals();
    setupDraftAutoSave();
    updatePaymentUI();

    document.getElementById('apply-coupon')?.addEventListener('click', () => applyCoupon());
    document.querySelectorAll('.quick-coupon').forEach(btn => {
        btn.addEventListener('click', () => applyCoupon(btn.dataset.code));
    });
    document.querySelectorAll('input[name="shipping"]').forEach(r => {
        r.addEventListener('change', calculateTotals);
    });
    document.querySelectorAll('input[name="payment"]').forEach(r => {
        r.addEventListener('change', updatePaymentUI);
    });
    document.getElementById('checkout-form')?.addEventListener('submit', handlePlaceOrder);
})();