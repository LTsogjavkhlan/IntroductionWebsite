const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function row(label, value) {
    return `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <div style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">${label}</div>
                <div style="font-size: 15px; color: #222; margin-top: 2px;">${value}</div>
            </td>
        </tr>`;
}

function buildHtml({ name, phone, email, subject, message }) {
    return `
    <div style="background: #f4f4f7; padding: 32px 16px; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
            <div style="background: #069494; padding: 20px 24px;">
                <h1 style="margin: 0; font-size: 18px; color: #ffffff;">Шинэ Холбоо Барих Хүсэлт</h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.85);">MindOra</p>
            </div>
            <div style="padding: 8px 24px 4px;">
                <table style="width: 100%; border-collapse: collapse;">
                    ${row('Нэр', escapeHtml(name))}
                    ${row('Имэйл', `<a href="mailto:${escapeHtml(email)}" style="color: #069494; text-decoration: none;">${escapeHtml(email)}</a>`)}
                    ${row('Утас', escapeHtml(phone) || 'Оруулаагүй')}
                    ${row('Гарчиг', escapeHtml(subject) || 'Холбоо барих хүсэлт')}
                </table>
            </div>
            <div style="padding: 4px 24px 24px;">
                <div style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Мессеж</div>
                <div style="background: #f0f9f8; border: 1px solid #cdeae8; border-radius: 8px; padding: 14px 16px; font-size: 15px; line-height: 1.5; color: #222; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
        </div>
        <p style="max-width: 480px; margin: 16px auto 0; text-align: center; font-size: 12px; color: #999;">
            MindOra-ийн холбоо барих маягтаас илгээгдсэн &mdash; ${escapeHtml(name)}-д хариулахын тулд шууд хариу бичнэ үү.
        </p>
    </div>`;
}

async function sendContactMail({ name, phone, email, subject, message }) {
    await transporter.sendMail({
        from: `"MindOra Contact Form" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `${name}-с ирсэн хүсэлт - ${subject || 'Холбоо барих хүсэлт'}`,
        text: `Нэр: ${name}\nУтас: ${phone || 'Оруулаагүй'}\nИмэйл: ${email}\nГарчиг: ${subject || 'Холбоо барих хүсэлт'}\n\nМессеж:\n${message}`,
        html: buildHtml({ name, phone, email, subject, message }),
    });
}

module.exports = { sendContactMail };
