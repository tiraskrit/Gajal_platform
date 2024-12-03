# test_email.py
from email_service import EmailService

def test_email():
    email_service = EmailService()
    result = email_service.send_verification_email(
        "e_uttam@yahoo.com",
        "test-token-123"
    )
    print("Email sent successfully" if result else "Failed to send email")

if __name__ == "__main__":
    test_email()