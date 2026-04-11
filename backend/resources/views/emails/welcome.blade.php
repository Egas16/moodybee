<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset agar tidak ada spasi aneh di Gmail/Outlook */
        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #ffffff; }
        table { border-spacing: 0; font-family: sans-serif; color: #333333; }
        td { padding: 0; }
        img { border: 0; }
    </style>
</head>
<body>
    <center style="width: 100%; table-layout: fixed; background-color: #ffffff; padding-bottom: 40px;">
        <div style="max-width: 600px; background-color: #ffffff;">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; margin-top: 20px;">
                <tr>
                    <td align="center" style="padding: 10px;">
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #7CCC29; border-radius: 40px; overflow: hidden;">
                            <tr>
                                <td align="center" style="padding: 50px 30px;">
                                    
                                    <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 15px 0; font-weight: bold;">
                                        Halo, {{ $user->username }}! 👋
                                    </h1>
                                    
                                    <p style="color: #ffffff; font-size: 16px; margin: 0 0 35px 0; line-height: 1.5;">
                                        Terima kasih sudah mendaftar di <strong>Moodybee</strong>.<br> 
                                        Satu langkah lagi, klik tombol di bawah untuk verifikasi akunmu.
                                    </p>
                                    
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" bgcolor="#ffffff" style="border-radius: 30px;">
                                                <a href="{{ $url }}" target="_blank" style="padding: 18px 45px; font-size: 18px; color: #FDB813; text-decoration: none; font-weight: bold; display: inline-block;">
                                                    Verifikasi Akun
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                </td>
                            </tr>
                        </table>
                        <p style="color: #aaaaaa; font-size: 12px; margin-top: 20px;">
                            &copy; 2026 Moodybee App. Jika kamu tidak merasa mendaftar, abaikan email ini.
                        </p>

                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>