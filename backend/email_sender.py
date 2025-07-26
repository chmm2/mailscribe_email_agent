import ssl
from email.message import EmailMessage

def send_email(smtp_config, to, subject, body, smtp_username, smtp_password, cc=None):
    import smtplib
    from email.mime.text import MIMEText

    msg = MIMEText(body, "plain")
    msg["Subject"] = subject
    msg["From"] = smtp_username
    msg["To"] = to
    if cc:
        if isinstance(cc, list):
            msg["Cc"] = ", ".join(cc)
        else:
            msg["Cc"] = cc

    recipients = [to]
    if cc:
        if isinstance(cc, list):
            recipients += cc
        else:
            recipients.append(cc)

    with smtplib.SMTP(smtp_config.host, smtp_config.port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, recipients, msg.as_string())
