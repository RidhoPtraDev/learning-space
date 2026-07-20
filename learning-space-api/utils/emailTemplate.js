/**
 * Template Email Resubable untuk LearningSpace
 * Menggunakan warna brand resmi:
 * - Primary Blue: #0066FF
 * - Darker Blue: #0047CC
 * - Light Blue: #EBF2FF
 */
exports.buildEmailHTML = ({ headerTitle, headerSubtitle, bodyContent }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${headerTitle}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;margin:20px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg, #0047CC, #0066FF);padding:28px 32px;text-align:center;">
            <h2 style="color:#ffffff;margin:0;font-size:1.4rem;font-weight:800;letter-spacing:-0.5px;">📚 LearningSpace</h2>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:0.9rem;font-weight:500;">${headerSubtitle}</p>
          </td>
        </tr>
        
        <!-- BODY CONTENT -->
        <tr>
          <td style="padding:32px;background-color:#ffffff;">
            ${bodyContent}
          </td>
        </tr>
        
        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:0.78rem;color:#888888;line-height:1.5;">
            <p style="margin:0 0 8px;">Email ini dikirim secara otomatis oleh sistem LearningSpace, mohon tidak membalas email ini.</p>
            <p style="margin:0;">Butuh bantuan? Hubungi support kami di <a href="mailto:support@learningspace.com" style="color:#0066FF;text-decoration:none;font-weight:600;">support@learningspace.com</a></p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
