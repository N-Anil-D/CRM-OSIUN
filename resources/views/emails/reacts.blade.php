<!-- resources/views/emails/ticket.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Osius CRM - Melding Status Gewijzigd</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.= 0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <style>
        @media only screen and (max-width: 600px) {
            .inner-body {
                width: 100% !important;
            }

            .footer {
                width: 100% !important;
            }
        }

        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
            }
        }.custom-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-family: Arial, sans-serif;
        }

        .custom-table th {
            background-color: #f2f2f2; /* Hafif gri arka plan */
            color: #333; /* Koyu gri metin */
            padding: 10px; /* Başlıklara boşluk ekleyelim */
            text-align: left; /* Başlıkları sola hizala */
            font-size: 14px;
            border-bottom: 2px solid #ddd;
        }

        .custom-table td {
            padding: 10px; /* Hücrelerin içine boşluk ekleyelim */
            border-bottom: 1px solid #ddd; /* Alt kenarlığa hafif gri çizgi */
            font-size: 13px;
        }

        .custom-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .custom-table, .custom-table th, .custom-table td {
            border: none;
        }

        .custom-table tr:hover {
            background-color: #f1f1f1;
        }

        .custom-table th {
            font-weight: bold;
        }

        .custom-table thead {
            border-bottom: 2px solid #ddd;
        }

        .custom-table {
            margin-left: auto;
            margin-right: auto;
        }
    </style>
</head>
<body
    style="box-sizing: border-box; font-family: -apple-system, BlinkMac SystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color =  Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; background-color: #ffffff; color: #1E1F22; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">


<table class="wrapper" width="100%" cellpadding="0" cellspacing="0"
       role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7;
margin: 0; padding: 0; width: 100%;">
    <tr>
        <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    position: relative;">
            <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;
     font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position:
    relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; margin: 0; padding: 0; width: 100%;">
                <tr>
                    <td class="header" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
     position: relative; padding: 25px 0; text-align: center;">
                        <a href="https://crm.osius.nl" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
     Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
     position: relative; color: #3d4852; font-size: 19px; font-weight: bold; text-decoration: none; display: inline-block;">
                            OsiusCRM
                        </a>
                    </td>
                </tr>

                <!-- Email Body -->
                <tr>
                    <td class="body" width="100%" cellpadding="0" cellspacing="0"
                        style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
            'Segoe UI' , Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0;
     -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; border-bottom: 1px solid #edf2f7;
     border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%; border: hidden !important;">
                        <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0"
                               role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0;
             -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #ffffff; border-color: #e8e5ef; border-radius:
             2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    position: relative; max-width: 100vw; padding: 32px;">
                                    <h1 style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
     sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3d4852;
     font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;">Hallo!</h1>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px;
    line-height: 1.5em; margin-top: 0; text-align: left;">
                                        <strong>{{ $react->evaluator_persons }}</strong> heeft de status gewijzigd van
                                        de melding.
                                    </p>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px;
    line-height: 1.5em; margin-top: 0; text-align: left;">
                                        <strong>Oude status:</strong> {{ $react->before_status }}
                                    </p>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px;
    line-height: 1.5em; margin-top: 0; text-align: left;">
                                        <strong>Nieuwe status:</strong> {{ $react->after_status }}
                                    </p>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px;
    line-height: 1.5em; margin-top: 0; text-align: left;">
                                        <strong>Gewijzigd datum:</strong> {{ $react->created_at }}
                                    </p>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px;
    line-height: 1.5em; margin-top: 0; text-align: left;">
                                        <strong>Activiteit bericht:</strong> {{ $react->react_text }}
                                    </p>
                                    <table class="action" align="center" width="100%" cellpadding="0" cellspacing="0"
                                           role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                                    position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%;
                                    margin: 30px auto; padding: 0; text-align: center; width: 100%;">
                                        <tr>
                                            <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                       role="presentation"
                                                       style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                                     'Segoe UI Symbol'; position: relative;">
                                                    <tr>
                                                        <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   role="presentation" style="box-sizing: border-box; font-family: -apple-system,
                                    BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                                     'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                <tr>
                                                                    <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                        <a href="https://crm.osius.nl/ticketdetail/54"
                                                                           class="button button-primary" target="_blank"
                                                                           rel="noopener" style="box-sizing: border-box;
                                                   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                                                   sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                                                    position: relative; -webkit-text-size-adjust: none; border-radius: 4px;
                                                     color: #fff; display: inline-block; overflow: hidden; text-decoration: none;
                                                      background-color: #2d3748; border-bottom: 8px solid #2d3748; border-left: 18px solid #2d3748;
                                                       border-right: 18px solid #2d3748; border-top: 8px solid #2d3748;">Show
                                                                            Meldingen</a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
<br>
                                    <p align="center"><strong>Eerdere statuswijzigingen:</strong></p>
                                    <table class="custom-table" width="100%" cellpadding="0" cellspacing="0"
                                    role="doc-afterword" style=" overflow-x:auto;-webkit-overflow-scrolling:touch; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                                    position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7;
                                    margin: 0; padding: 0; width: 100%;">
                                        <thead>
                                        <tr>
                                            <th>Evaluatoren</th>
                                            <th>Activiteit</th>
                                            <th>Oude status</th>
                                            <th>Nieuwe status</th>
                                            <th>Gewijzigd datum</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        @foreach ($rows as $row)
                                            <tr>
                                                <td>{{ $row[0] }}</td>
                                                <td>{{ $row[1] }}</td>
                                                <td>{{ $row[2] }}</td>
                                                <td>{{ $row[3] }}</td>
                                                <td>{{ $row[4] }}</td>
                                            </tr>
                                        @endforeach
                                        </tbody>
                                    </table>

                                    <br><br>
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                     'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                                     position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                        Regards,<br>
                                        OsiusCRM</p>


                                    <table class="subcopy" width="100%" cellpadding="0" cellspacing="0"
                                           role="presentation"
                                           style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                                     'Segoe UI Symbol'; position: relative; border-top: 1px solid #e8e5ef; margin-top: 25px; padding-top: 25px;">
                                        <tr>
                                            <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
                                     'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                                      position: relative; line-height: 1.5em; margin-top: 0; text-align: left; font-size: 14px;">
                                                    If you're having trouble clicking the "Show Meldingen" button, copy
                                                    and paste the URL below
                                                    into your web browser: <span class="break-all" style="box-sizing: border-box; font-family: -apple-system,
                                         BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                                          'Segoe UI Symbol'; position: relative; word-break: break-all;">
                                            <a href="https://crm.osius.nl/ticketdetail/54" style="box-sizing: border-box; font-family: -apple-system,
                                             BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                                              'Segoe UI Symbol'; position: relative; color: #3869d4;">https://crm.osius.nl/ticketdetail/54
                                            </a>
                                        </span>
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
                    <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                        <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0"
                               role="presentation"
                               style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
             position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; margin: 0 auto;
              padding: 0; text-align: center; width: 570px;">
                            <tr>
                                <td class="content-cell" align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;
     max-width: 100vw; padding: 32px;">
                                    <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;
            line-height: 1.5em; margin-top: 0; color: #b0adc5; font-size: 12px; text-align: center;">
                                        © 2024 OsiusCRM. All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
