
export const mailTemp = ({ title, otp, text, username = "there", lang = "en" }) => {
  const isAr = lang === "ar";
  const defaultTitle = "Email Verification";
  const displayTitle = title || defaultTitle;
  const safeOtp = String(otp ?? "").trim();
  const otpDigits = safeOtp.split("");

  // Generate OTP boxes HTML using the new design class and styling
  const otpBoxesHtml = otpDigits.length > 0
    ? otpDigits.map((digit) => `
        <td style="padding:0 4px;">
            <div class="otp-digit dark-otp-digit" style="
                width:48px; 
                height:58px; 
                background: linear-gradient(145deg, #F9FDF9, #F1FBF0);
                border: 2px solid #A2E094;
                border-radius:12px; 
                font-size:28px; 
                font-weight:800; 
                color:#2A6B1C;
                line-height:58px;
                text-align:center;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            ">${digit}</div>
        </td>
      `).join("")
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${displayTitle}</title>

    <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

    <style>
        /* Reset & Base */
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        /* Animations */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.05);
            }
        }

        @keyframes shimmer {
            0% {
                background-position: -1000px 0;
            }

            100% {
                background-position: 1000px 0;
            }
        }

        .animated-card {
            animation: fadeIn 0.6s ease-out;
        }

        .otp-box:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease;
        }

        /* Responsive */
        @media only screen and (max-width: 620px) {
            .email-container {
                width: 100% !important;
                margin: 0 auto !important;
            }

            .fluid {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            .mobile-padding {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .otp-digit {
                width: 40px !important;
                height: 50px !important;
                font-size: 22px !important;
                line-height: 50px !important;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            .dark-bg {
                background-color: #0d150b !important;
                background: #0d150b !important;
            }

            .dark-card {
                background-color: #121f10 !important;
                background: #121f10 !important;
            }

            .dark-text {
                color: #e2ecd3 !important;
            }

            .dark-muted {
                color: #9ab495 !important;
            }

            .dark-wave {
                fill: #121f10 !important;
            }

            .dark-border {
                border-color: #223a1d !important;
            }

            .dark-otp-digit {
                background: #1a3018 !important;
                border-color: #539e3e !important;
                color: #a2e094 !important;
            }

            .dark-security-notice {
                background: #2b1616 !important;
                border-left-color: #ef4444 !important;
            }

            .dark-security-text {
                color: #fca5a5 !important;
            }

            .dark-custom-message-bg {
                background: #152d13 !important;
                border-color: #223a1d !important;
            }

            .dark-custom-message-text {
                color: #a2e094 !important;
            }

            .dark-feature {
                background: #152d13 !important;
            }

            .dark-feature-text {
                color: #a2e094 !important;
            }

            .dark-divider {
                background: linear-gradient(90deg, transparent, #223a1d, transparent) !important;
            }
        }
    </style>
</head>

<body
    style="margin:0; padding:0; background:#F3FAF0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

    <!-- Preview Text -->
    <div
        style="display:none; font-size:1px; color:#F3FAF0; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
        ${otp ? `Your OTP code is: ${safeOtp}` : displayTitle}
        &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
    </div>

    <!-- Main Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dark-bg"
        style="background: linear-gradient(180deg, #F3FAF0 0%, #E2F3DC 100%); min-height:100vh;">
        <tr>
            <td align="center" style="padding:40px 15px;">

                <!-- Email Container -->
                <table role="presentation" class="email-container animated-card dark-card" width="600" cellpadding="0"
                    cellspacing="0" border="0"
                    style="max-width:600px; width:100%; background:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1);">

                    <!-- Decorative Top Bar -->
                    <tr>
                        <td
                            style="height:6px; background: linear-gradient(90deg, #68BC52, #539E3E, #A2E094, #68BC52); background-size: 300% 100%; animation: shimmer 3s ease-in-out infinite;">
                        </td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding:0;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background: linear-gradient(135deg, #0F172A 0%, #173811 50%, #295720 100%);">
                                <tr>
                                    <td style="padding:32px 40px; text-align:center;">
                                        <p
                                            style="margin:0 0 4px 0; font-size:26px; font-weight:800; color:#FFFFFF; letter-spacing:1px;">
                                            RDS Pharmaco
                                        </p>
                                        <p
                                            style="margin:0; font-size:13px; color:#A2E094; font-weight:400; letter-spacing:2px; text-transform:uppercase;">
                                            Powered by RDS Pharmaco
                                        </p>
                                    </td>
                                </tr>

                                <!-- Wave Decoration -->
                                <tr>
                                    <td style="font-size:0; line-height:0;">
                                        <svg viewBox="0 0 600 40" style="display:block; width:100%;">
                                            <path class="dark-wave" d="M0,40 L0,20 Q150,0 300,20 T600,20 L600,40 Z" fill="#FFFFFF" />
                                        </svg>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding:20px 48px 36px 48px;">

                            <!-- Icon Badge -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                                style="margin:0 auto 24px auto;">
                                <tr>
                                    <td align="center">
                                        <div style="
                       width:90px; 
                       height:90px; 
                       background: linear-gradient(145deg, #F1FBF0, #E2F3DC);
                       border-radius:22px; 
                       box-shadow: 0 10px 25px -5px rgba(104, 188, 82, 0.3), inset 0 1px 0 rgba(255,255,255,0.8);
                       text-align:center;
                       line-height:90px;
                     ">
                                            <span style="font-size:42px;">📦</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Greeting -->
                            <p
                                style="margin:0 0 8px 0; font-size:15px; color:#68BC52; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; text-align:center;">
                                ${otp ? "Verification Required" : "Hello"}
                            </p>

                            <!-- Title -->
                            <h1 class="dark-text"
                                style="margin:0 0 16px 0; font-size:30px; line-height:1.3; color:#0F172A; font-weight:800; text-align:center; letter-spacing:-0.5px;">
                                ${displayTitle}
                            </h1>

                            <!-- Subtitle -->
                            <p class="dark-muted"
                                style="margin:0 0 28px 0; font-size:16px; line-height:1.7; color:#64748B; text-align:center;">
                                Hi <strong class="dark-text" style="color:#0F172A;">${username}</strong>,
                                ${otp ? "Please use the code below to verify your account." : "Thank you for being with us."}
                            </p>

                            ${otp ? `
                            <!-- OTP Section -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="margin:0 auto 24px auto;">
                                <tr>
                                    <td align="center">
                                        <div class="dark-custom-message-bg dark-border"
                                            style="background: linear-gradient(145deg, #F9FDF9, #F1FBF0); border-radius:20px; padding:28px 20px; border: 1px solid #E2F3DC;">

                                            <!-- OTP Digits -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                                                style="margin:0 auto;">
                                                <tr>
                                                    ${otpBoxesHtml}
                                                </tr>
                                            </table>

                                            <!-- Timer Badge -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                                                style="margin:18px auto 0 auto;">
                                                <tr>
                                                    <td
                                                        style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding:8px 16px; border-radius:50px;">
                                                        <span style="font-size:13px; color:#92400E; font-weight:600;">
                                                            Expires in 10 minutes
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>

                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="margin:0 auto 20px auto;">
                                <tr>
                                    <td class="dark-security-notice"
                                        style="background: #FEF2F2; border-radius:12px; padding:16px 20px; border-left:4px solid #EF4444;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding-right:12px;">
                                                    <span style="font-size:20px;">🛡️</span>
                                                </td>
                                                <td>
                                                    <p class="dark-security-text"
                                                        style="margin:0; font-size:13px; color:#991B1B; line-height:1.5; font-weight:500;">
                                                        <strong>Security Tip:</strong> Never share your OTP with anyone.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            ` : ""}

                            ${text ? `
                            <!-- Custom Message -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px auto;">
                              <tr>
                                <td class="dark-custom-message-bg dark-border" style="background: linear-gradient(145deg, #F4FBF3, #E8F7E5); border-radius:16px; padding:24px; border:1px solid #C4EBC0;">
                                  <p class="dark-custom-message-text" style="margin:0; font-size:15px; color:#2A6B1C; line-height:1.7; text-align:center;">
                                    ${text}
                                  </p>
                                </td>
                              </tr>
                            </table>
                            ` : ""}

                            <!-- CTA Button -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                                style="margin:10px auto 0 auto;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'https://rdspharmaco.com'}" target="_blank" style="
                        display:inline-block; 
                        padding:16px 40px; 
                        background: linear-gradient(135deg, #68BC52 0%, #539E3E 50%, #448831 100%);
                        border-radius:14px; 
                        color:#FFFFFF; 
                        text-decoration:none; 
                        font-size:15px; 
                        font-weight:700;
                        box-shadow: 0 10px 25px -5px rgba(104, 188, 82, 0.5), 0 4px 6px -2px rgba(104, 188, 82, 0.3);
                        letter-spacing:0.3px;
                      ">
                                            Visit Website
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Features Section -->
                    <tr>
                        <td class="mobile-padding" style="padding:0 48px 36px 48px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <!-- Feature 1 -->
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#F4FBF3; border-radius:14px; padding:20px 12px;">
                                            <span style="font-size:28px;">🔒</span>
                                            <p class="dark-feature-text"
                                                style="margin:10px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">
                                                Secure</p>
                                        </div>
                                    </td>
                                    <!-- Feature 2 -->
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#F1FBF0; border-radius:14px; padding:20px 12px;">
                                            <span style="font-size:28px;">⚡</span>
                                            <p class="dark-feature-text"
                                                style="margin:10px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">
                                                Fast</p>
                                        </div>
                                    </td>
                                    <!-- Feature 3 -->
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#E2F3DC; border-radius:14px; padding:20px 12px;">
                                            <span style="font-size:28px;">💎</span>
                                            <p class="dark-feature-text"
                                                style="margin:10px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">
                                                Premium</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:0 48px;">
                            <div class="dark-divider"
                                style="height:1px; background: linear-gradient(90deg, transparent, #E2E8F0, transparent);">
                            </div>
                        </td>
                    </tr>



                    <!-- Bottom Decorative Bar -->
                    <tr>
                        <td
                            style="height:6px; background: linear-gradient(90deg, #68BC52, #539E3E, #A2E094, #68BC52); background-size: 300% 100%;">
                        </td>
                    </tr>

                </table>

                <!-- Bottom Footer -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0 auto;">
                    <tr>
                        <td align="center">
                            <p style="margin:0; font-size:11px; color:#94A3B8;">
                                Powered with 💚 by <strong style="color:#68BC52;">RDS Pharmaco</strong>
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>

</html>`
};

export const orderConfirmationTemp = ({ order, lang = "en" }) => {
  const isAr = lang === "ar";
  
  // Localized texts
  const t = {
    title: isAr ? "تأكيد الطلب - RDS Pharmaco" : "Order Confirmation - RDS Pharmaco",
    hello: isAr ? "مرحباً" : "Hello",
    thankYou: isAr ? "تم إنشاء طلبك بنجاح!" : "Your order has been successfully created!",
    orderId: isAr ? "رقم الطلب:" : "Order Number:",
    date: isAr ? "تاريخ الطلب:" : "Order Date:",
    paymentMethod: isAr ? "طريقة الدفع:" : "Payment Method:",
    shippingAddress: isAr ? "عنوان الشحن" : "Shipping Address",
    phone: isAr ? "الهاتف:" : "Phone:",
    address: isAr ? "العنوان:" : "Address:",
    items: isAr ? "العناصر المطلوبة" : "Ordered Items",
    product: isAr ? "المنتج" : "Product",
    qty: isAr ? "الكمية" : "Qty",
    price: isAr ? "السعر" : "Price",
    total: isAr ? "الإجمالي" : "Total",
    subtotal: isAr ? "الإجمالي الفرعي:" : "Subtotal:",
    shipping: isAr ? "تكلفة الشحن:" : "Shipping:",
    discount: isAr ? "الخصم:" : "Discount:",
    grandTotal: isAr ? "الإجمالي الكلي:" : "Grand Total:",
    visitStore: isAr ? "زيارة المتجر" : "Visit Store",
    accountCreatedTitle: isAr ? "تم إنشاء حساب لك!" : "An account has been created for you!",
    accountCreatedMsg: isAr ? "تم إنشاء حساب تلقائي لتتمكن من تتبع طلباتك. بيانات الدخول المؤقتة:" : "We created an account for you to track your orders. Temporary login details:",
    email: isAr ? "البريد الإلكتروني:" : "Email:",
    password: isAr ? "كلمة المرور:" : "Password:",
    passwordWarning: isAr ? "يرجى تغيير كلمة المرور بعد تسجيل الدخول لحماية حسابك." : "Please change your password after logging in to secure your account.",
    secure: isAr ? "آمن" : "Secure",
    fast: isAr ? "سريع" : "Fast",
    premium: isAr ? "مميز" : "Premium",
  };

  const itemsHtml = (order.items || []).map(item => `
    <tr class="dark-table-row" style="border-bottom: 1px solid #E2E8F0;">
      <td class="dark-table-text" style="padding: 12px 8px; font-size: 14px; color: #0F172A; text-align: ${isAr ? 'right' : 'left'};">
        ${item.name}
      </td>
      <td class="dark-table-muted" style="padding: 12px 8px; font-size: 14px; color: #64748B; text-align: center;">
        x${item.quantity}
      </td>
      <td class="dark-table-muted" style="padding: 12px 8px; font-size: 14px; color: #64748B; text-align: center;">
        ${item.unitPrice} ${order.currency.toUpperCase()}
      </td>
      <td class="dark-table-text" style="padding: 12px 8px; font-size: 14px; color: #0F172A; text-align: ${isAr ? 'left' : 'right'}; font-weight: 600;">
        ${item.totalPrice} ${order.currency.toUpperCase()}
      </td>
    </tr>
  `).join("");

  const accountInfoHtml = order.user && order.user.password ? `
    <!-- Account Information -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto;">
      <tr>
        <td class="dark-account-bg" style="background: linear-gradient(145deg, #FFFDF5, #FFFBEB); border-radius:16px; padding:24px; border:1px solid #FCD34D;">
          <h3 class="dark-account-title" style="margin:0 0 10px 0; font-size:16px; color:#B45309; text-align:${isAr ? 'right' : 'left'}; font-weight:700;">
            🔑 ${t.accountCreatedTitle}
          </h3>
          <p class="dark-account-text" style="margin:0 0 12px 0; font-size:14px; color:#78350F; line-height:1.6; text-align:${isAr ? 'right' : 'left'};">
            ${t.accountCreatedMsg}
          </p>
          <div class="dark-account-box" style="background:#FFFFFF; border-radius:10px; padding:12px; border:1px solid #FDE68A; font-family:monospace; font-size:13px; color:#1F2937; margin-bottom:12px; text-align:${isAr ? 'right' : 'left'};">
            <strong>${t.email}</strong> ${order.user.email}<br>
            <strong>${t.password}</strong> ${order.user.password}
          </div>
          <p style="margin:0; font-size:12px; color:#B45309; font-style:italic; text-align:${isAr ? 'right' : 'left'};">
            * ${t.passwordWarning}
          </p>
        </td>
      </tr>
    </table>
  ` : "";

  const shippingAddressHtml = order.shippingAddress ? `
    <!-- Shipping Address Section -->
    <h3 class="dark-text" style="margin:0 0 12px 0; font-size:16px; color:#0F172A; font-weight:700; border-bottom:2px solid #F1F5F9; padding-bottom:8px; text-align:${isAr ? 'right' : 'left'};">
        📍 ${t.shippingAddress}
    </h3>
    <div class="dark-meta-bg dark-text" style="background:#F8FAFC; border-radius:12px; padding:16px; border:1px solid #E2E8F0; margin-bottom:32px; font-size:14px; color:#334155; line-height:1.6; text-align:${isAr ? 'right' : 'left'};">
        <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br>
        <strong>${t.phone}</strong> ${order.shippingAddress.phone}<br>
        <strong>${t.address}</strong> ${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${t.title}</title>
    <style>
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animated-card {
            animation: fadeIn 0.6s ease-out;
        }
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; }
            .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            .dark-bg {
                background-color: #0d150b !important;
                background: #0d150b !important;
            }
            .dark-card {
                background-color: #121f10 !important;
                background: #121f10 !important;
            }
            .dark-text {
                color: #e2ecd3 !important;
            }
            .dark-muted {
                color: #9ab495 !important;
            }
            .dark-border {
                border-color: #223a1d !important;
            }
            .dark-meta-bg {
                background-color: #1a3018 !important;
                border-color: #223a1d !important;
            }
            .dark-table-header {
                color: #9ab495 !important;
                border-bottom-color: #223a1d !important;
            }
            .dark-table-row {
                border-bottom-color: #223a1d !important;
            }
            .dark-table-text {
                color: #ffffff !important;
            }
            .dark-table-muted {
                color: #9ab495 !important;
            }
            .dark-grand-total {
                color: #ffffff !important;
                border-top-color: #223a1d !important;
            }
            .dark-grand-total-amount {
                color: #a2e094 !important;
            }
            .dark-feature {
                background: #152d13 !important;
            }
            .dark-feature-text {
                color: #a2e094 !important;
            }
            .dark-account-bg {
                background: #2b1e10 !important;
                border-color: #d97706 !important;
            }
            .dark-account-title {
                color: #fbbf24 !important;
            }
            .dark-account-text {
                color: #fde68a !important;
            }
            .dark-account-box {
                background: #121f10 !important;
                border-color: #223a1d !important;
                color: #ffffff !important;
            }
        }
    </style>
</head>
<body style="margin:0; padding:0; background:#F3FAF0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dark-bg" style="background: linear-gradient(180deg, #F3FAF0 0%, #E2F3DC 100%); min-height:100vh;">
        <tr>
            <td align="center" style="padding:40px 15px;">
                <table role="presentation" class="email-container animated-card dark-card" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);">
                    <!-- Decorative Top Bar -->
                    <tr><td style="height:6px; background: linear-gradient(90deg, #68BC52, #539E3E, #A2E094, #68BC52);"></td></tr>
                    <!-- Header -->
                    <tr>
                        <td style="padding:32px 40px; text-align:center; background: linear-gradient(135deg, #0F172A 0%, #173811 100%);">
                            <p style="margin:0 0 4px 0; font-size:26px; font-weight:800; color:#FFFFFF; letter-spacing:1px;">RDS Pharmaco</p>
                            <p style="margin:0; font-size:12px; color:#A2E094; text-transform:uppercase; letter-spacing:2px;">${t.title}</p>
                        </td>
                    </tr>
                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding:32px 48px;">
                            <!-- Greeting -->
                            <h2 class="dark-text" style="margin:0 0 12px 0; font-size:22px; color:#0F172A; font-weight:800; text-align:${isAr ? 'right' : 'left'};">
                                ${t.hello} ${order.user?.name || ''},
                            </h2>
                            <p class="dark-muted" style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:#475569; text-align:${isAr ? 'right' : 'left'};">
                                ${t.thankYou}
                            </p>

                            <!-- Order Meta Info -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dark-meta-bg" style="margin-bottom:24px; background:#F8FAFC; border-radius:12px; padding:16px; border:1px solid #E2E8F0;">
                                <tr>
                                    <td class="dark-muted" style="font-size:14px; color:#64748B; padding:4px 0; text-align:${isAr ? 'right' : 'left'};">
                                        <strong>${t.orderId}</strong> <span class="dark-text" style="font-family:monospace; color:#0F172A; font-weight:600;">#${order.orderNumber || order.id}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="dark-muted" style="font-size:14px; color:#64748B; padding:4px 0; text-align:${isAr ? 'right' : 'left'};">
                                        <strong>${t.date}</strong> <span class="dark-text" style="color:#0F172A;">${new Date().toLocaleDateString(lang)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="dark-muted" style="font-size:14px; color:#64748B; padding:4px 0; text-align:${isAr ? 'right' : 'left'};">
                                        <strong>${t.paymentMethod}</strong> <span class="dark-text" style="color:#0F172A;">${order.paymentMethod || 'COD'}</span>
                                    </td>
                                </tr>
                            </table>

                            ${accountInfoHtml}

                            <!-- Products Table -->
                            <h3 class="dark-text" style="margin:0 0 12px 0; font-size:16px; color:#0F172A; font-weight:700; border-bottom:2px solid #F1F5F9; padding-bottom:8px; text-align:${isAr ? 'right' : 'left'};">
                                📦 ${t.items}
                            </h3>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                                <thead>
                                    <tr class="dark-border" style="border-bottom: 2px solid #E2E8F0;">
                                        <th class="dark-table-muted" style="padding:8px; font-size:12px; font-weight:700; color:#64748B; text-align:${isAr ? 'right' : 'left'};">${t.product}</th>
                                        <th class="dark-table-muted" style="padding:8px; font-size:12px; font-weight:700; color:#64748B; text-align:center;">${t.qty}</th>
                                        <th class="dark-table-muted" style="padding:8px; font-size:12px; font-weight:700; color:#64748B; text-align:center;">${t.price}</th>
                                        <th class="dark-table-muted" style="padding:8px; font-size:12px; font-weight:700; color:#64748B; text-align:${isAr ? 'left' : 'right'};">${t.total}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>

                            <!-- Pricing summary -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dark-border" style="margin-bottom:32px; border-top:1px solid #E2E8F0; padding-top:12px;">
                                <tr>
                                    <td class="dark-muted" style="padding:6px 0; font-size:14px; color:#64748B; text-align:${isAr ? 'right' : 'left'};">${t.subtotal}</td>
                                    <td class="dark-text" style="padding:6px 0; font-size:14px; color:#0F172A; text-align:${isAr ? 'left' : 'right'}; font-weight:600;">
                                        ${order.subtotal || order.total} ${order.currency.toUpperCase()}
                                    </td>
                                </tr>
                                ${order.shippingAmount ? `
                                <tr>
                                    <td class="dark-muted" style="padding:6px 0; font-size:14px; color:#64748B; text-align:${isAr ? 'right' : 'left'};">${t.shipping}</td>
                                    <td class="dark-text" style="padding:6px 0; font-size:14px; color:#0F172A; text-align:${isAr ? 'left' : 'right'}; font-weight:600;">
                                        +${order.shippingAmount} ${order.currency.toUpperCase()}
                                    </td>
                                </tr>
                                ` : ''}
                                ${order.discountAmount ? `
                                <tr>
                                    <td class="dark-muted" style="padding:6px 0; font-size:14px; color:#EF4444; text-align:${isAr ? 'right' : 'left'};">${t.discount}</td>
                                    <td class="dark-text" style="padding:6px 0; font-size:14px; color:#EF4444; text-align:${isAr ? 'left' : 'right'}; font-weight:600;">
                                        -${order.discountAmount} ${order.currency.toUpperCase()}
                                    </td>
                                </tr>
                                ` : ''}
                                <tr class="dark-grand-total" style="border-top:2px double #E2E8F0;">
                                    <td class="dark-text" style="padding:12px 0 0 0; font-size:16px; color:#0f172a; font-weight:800; text-align:${isAr ? 'right' : 'left'};">${t.grandTotal}</td>
                                    <td class="dark-grand-total-amount" style="padding:12px 0 0 0; font-size:20px; color:#1e3a1e; text-align:${isAr ? 'left' : 'right'}; font-weight:800;">
                                        ${order.total} ${order.currency.toUpperCase()}
                                    </td>
                                </tr>
                            </table>

                            ${shippingAddressHtml}

                            <!-- Visit Website Button -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'https://rdspharmaco.com'}" target="_blank" style="display:inline-block; padding:14px 32px; background:linear-gradient(135deg, #68BC52 0%, #539E3E 100%); border-radius:12px; color:#FFFFFF; text-decoration:none; font-size:15px; font-weight:700; box-shadow:0 10px 20px -5px rgba(104, 188, 82, 0.4);">
                                            ${t.visitStore}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                    <!-- Features Section -->
                    <tr>
                        <td style="padding:0 48px 32px 48px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#F4FBF3; border-radius:12px; padding:16px 8px;">
                                            <span style="font-size:24px;">🔒</span>
                                            <p class="dark-feature-text" style="margin:8px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">${t.secure}</p>
                                        </div>
                                    </td>
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#F1FBF0; border-radius:12px; padding:16px 8px;">
                                            <span style="font-size:24px;">⚡</span>
                                            <p class="dark-feature-text" style="margin:8px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">${t.fast}</p>
                                        </div>
                                    </td>
                                    <td width="33%" style="text-align:center; padding:0 8px;">
                                        <div class="dark-feature" style="background:#E2F3DC; border-radius:12px; padding:16px 8px;">
                                            <span style="font-size:24px;">💎</span>
                                            <p class="dark-feature-text" style="margin:8px 0 0 0; font-size:12px; color:#2A6B1C; font-weight:600;">${t.premium}</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr><td style="height:6px; background: linear-gradient(90deg, #68BC52, #539E3E, #A2E094, #68BC52);"></td></tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0 auto;">
                    <tr>
                        <td align="center">
                            <p style="margin:0; font-size:11px; color:#94A3B8;">
                                Powered with 💚 by <strong style="color:#68BC52;">RDS Pharmaco</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};