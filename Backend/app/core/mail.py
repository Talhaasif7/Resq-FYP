from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr
from app.core.config import settings
from typing import List

conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_MAIL,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.SMTP_MAIL,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)

async def send_email(subject: str, recipients: List[EmailStr], body: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype=MessageType.html
    )
    await fastmail.send_message(message)

async def send_verification_email(email: EmailStr, link: str):
    html = f"""
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                body {{ font-family: 'Inter', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }}
                .header {{ background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 20px; text-align: center; color: white; }}
                .content {{ padding: 40px; color: #1e293b; line-height: 1.6; }}
                .button {{ display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; margin: 20px 0; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }}
                .footer {{ background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 0.875rem; }}
                h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your ResQ Account</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Welcome to ResQ! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
                    <div style="text-align: center;">
                        <a href="{link}" class="button">Verify Email Address</a>
                    </div>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ResQ Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """
    await send_email("Verify your ResQ account", [email], html)

async def send_reset_password_email(email: EmailStr, link: str):
    html = f"""
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                body {{ font-family: 'Inter', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }}
                .header {{ background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); padding: 40px 20px; text-align: center; color: white; }}
                .content {{ padding: 40px; color: #1e293b; line-height: 1.6; }}
                .button {{ display: inline-block; padding: 14px 28px; background-color: #e11d48; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; margin: 20px 0; box-shadow: 0 10px 15px -3px rgba(225, 29, 72, 0.3); }}
                .footer {{ background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 0.875rem; }}
                h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your ResQ account. Click the button below to set a new password:</p>
                    <div style="text-align: center;">
                        <a href="{link}" class="button">Reset Password</a>
                    </div>
                    <p>This link will expire soon. If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ResQ Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """
    await send_email("Reset your ResQ password", [email], html)
