function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function createPasswordResetEmail(resetUrl: string): string {
  const safeUrl = escapeHtml(resetUrl);
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0; padding:0; background-color:#F1F5F9; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F1F5F9;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td style="padding:8px 8px 24px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle; padding-right:10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="32" height="32">
                      <tr>
                        <td align="center" valign="middle" width="32" height="32" style="width:32px; height:32px; background-color:#0598CE; border-radius:8px; color:#FFFFFF; font-size:14px; font-weight:bold; font-family:Arial, Helvetica, sans-serif;">
                          LP
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:16px; font-weight:bold; color:#0F172A; font-family:Arial, Helvetica, sans-serif;">Live Polling System</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; box-shadow:0 1px 3px rgba(15, 23, 42, 0.04);">
                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#F1F5F9; border-radius:6px; padding:4px 10px;">
                          <span style="font-size:12px; font-weight:bold; color:#0598CE; letter-spacing:0.5px; text-transform:uppercase; font-family:Arial, Helvetica, sans-serif;">Password reset</span>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-top:20px;">
                          <h1 style="margin:0; font-size:24px; line-height:32px; font-weight:bold; color:#0F172A; font-family:Arial, Helvetica, sans-serif;">Reset your password</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px;">
                          <p style="margin:0; font-size:15px; line-height:24px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            You requested a password reset for your Live Polling System account.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="border-radius:8px; background-color:#0598CE;">
                                <a href="${safeUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; color:#FFFFFF; text-decoration:none; border-radius:8px; font-family:Arial, Helvetica, sans-serif;">Reset password</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px;">
                          <p style="margin:0 0 6px 0; font-size:13px; line-height:20px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            If the button doesn't work, copy and paste this link into your browser:
                          </p>
                          <p style="margin:0; font-size:13px; line-height:20px; word-break:break-all; font-family:Arial, Helvetica, sans-serif;">
                            <a href="${safeUrl}" target="_blank" style="color:#0598CE; text-decoration:underline;">${safeUrl}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px; border-top:1px solid #E2E8F0;">
                          <p style="margin:20px 0 0 0; font-size:13px; line-height:20px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            For your security, this link may expire. If you did not request this, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 8px 8px;" align="center">
              <p style="margin:0; font-size:12px; line-height:18px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                © Live Polling System. This is an automated message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function createVerificationEmail(displayName: string, verificationUrl: string): string {
  const safeName = escapeHtml(displayName);
  const safeUrl = escapeHtml(verificationUrl);
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email address</title>
</head>
<body style="margin:0; padding:0; background-color:#F1F5F9; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F1F5F9;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td style="padding:8px 8px 24px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle; padding-right:10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="32" height="32">
                      <tr>
                        <td align="center" valign="middle" width="32" height="32" style="width:32px; height:32px; background-color:#0598CE; border-radius:8px; color:#FFFFFF; font-size:14px; font-weight:bold; font-family:Arial, Helvetica, sans-serif;">
                          LP
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:16px; font-weight:bold; color:#0F172A; font-family:Arial, Helvetica, sans-serif;">Live Polling System</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; box-shadow:0 1px 3px rgba(15, 23, 42, 0.04);">
                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#F1F5F9; border-radius:6px; padding:4px 10px;">
                          <span style="font-size:12px; font-weight:bold; color:#0598CE; letter-spacing:0.5px; text-transform:uppercase; font-family:Arial, Helvetica, sans-serif;">Email verification</span>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-top:20px;">
                          <h1 style="margin:0; font-size:24px; line-height:32px; font-weight:bold; color:#0F172A; font-family:Arial, Helvetica, sans-serif;">Verify your email address</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px;">
                          <p style="margin:0; font-size:15px; line-height:24px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            Hi ${safeName}, please verify your email address to finish setting up your Live Polling System account.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="border-radius:8px; background-color:#0598CE;">
                                <a href="${safeUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; color:#FFFFFF; text-decoration:none; border-radius:8px; font-family:Arial, Helvetica, sans-serif;">Verify email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px;">
                          <p style="margin:0 0 6px 0; font-size:13px; line-height:20px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            If the button doesn't work, copy and paste this link into your browser:
                          </p>
                          <p style="margin:0; font-size:13px; line-height:20px; word-break:break-all; font-family:Arial, Helvetica, sans-serif;">
                            <a href="${safeUrl}" target="_blank" style="color:#0598CE; text-decoration:underline;">${safeUrl}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:28px; border-top:1px solid #E2E8F0;">
                          <p style="margin:20px 0 0 0; font-size:13px; line-height:20px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                            If you didn't create an account with Live Polling System, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 8px 8px;" align="center">
              <p style="margin:0; font-size:12px; line-height:18px; color:#64748B; font-family:Arial, Helvetica, sans-serif;">
                © Live Polling System. This is an automated message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}