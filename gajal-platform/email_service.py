# email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import (
    SMTP_SERVER,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    FRONTEND_URL
)

class EmailService:
    def __init__(self):
        self.server = SMTP_SERVER
        self.port = SMTP_PORT
        self.username = SMTP_USERNAME
        self.password = SMTP_PASSWORD
        self.from_email = "rambahadurbhurtel42@gmail.com"  # Replace with your verified SendGrid sender

    def _create_smtp_connection(self):
        try:
            # Create SMTP connection
            server = smtplib.SMTP(self.server, self.port)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(self.username, self.password)
            print("connected")
            return server
        except Exception as e:
            print(f"Failed to create SMTP connection: {str(e)}")
            return None

    def _send_email(self, to_email, subject, html_content):
        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = self.from_email
            message['To'] = to_email

            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)

            # Send email
            smtp_server = self._create_smtp_connection()
            if smtp_server:
                smtp_server.sendmail(self.from_email, to_email, message.as_string())
                smtp_server.quit()
                return True
            return False
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False

    def send_reset_password_email(self, to_email, reset_token):
        reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
        subject = 'Reset Your Password'
        html_content = f'''
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">Reset Your Password</h2>
                        <p>You have requested to reset your password. Click the button below to set a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{reset_link}" 
                               style="background-color: #3498db; 
                                      color: white; 
                                      padding: 12px 24px; 
                                      text-decoration: none; 
                                      border-radius: 5px;
                                      display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>This link will expire in 24 hours.</p>
                        <p style="color: #7f8c8d; font-size: 0.9em;">If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
            </html>
        '''
        return self._send_email(to_email, subject, html_content)

    def send_verification_email(self, to_email, verification_token):
        verify_link = f"{FRONTEND_URL}/verify-email?token={verification_token}"
        subject = 'Verify Your Email'
        html_content = f'''
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Our Platform!</h2>
                        <p>Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verify_link}" 
                               style="background-color: #2ecc71; 
                                      color: white; 
                                      padding: 12px 24px; 
                                      text-decoration: none; 
                                      border-radius: 5px;
                                      display: inline-block;">
                                Verify Email
                            </a>
                        </div>
                        <p>This link will expire in 24 hours.</p>
                        <p style="color: #7f8c8d; font-size: 0.9em;">If you didn't create an account, please ignore this email.</p>
                    </div>
                </body>
            </html>
        '''
        return self._send_email(to_email, subject, html_content)