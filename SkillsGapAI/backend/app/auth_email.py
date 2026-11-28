"""SMTP delivery for email verification and password recovery."""

from __future__ import annotations

import os
import smtplib
import ssl
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import urlencode

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def is_configured() -> bool:
    return bool(os.getenv("SMTP_HOST", "").strip() and os.getenv("SMTP_FROM_EMAIL", "").strip())


def _action_link(config_name: str, token: str) -> str:
    base_url = os.getenv(config_name, "").strip()
    if not base_url:
        return token
    separator = "&" if "?" in base_url else "?"
    return f"{base_url}{separator}{urlencode({'token': token})}"


def send_verification_email(email: str, token: str) -> None:
    link_or_token = _action_link("EMAIL_VERIFICATION_URL", token)
    send_email(
        email,
        "Verify your SkillGap AI email",
        "Welcome to SkillGap AI!\n\n"
        "To activate your account, copy the verification token below and paste it into the Verify Email screen in SkillGap AI.\n\n"
        f"{link_or_token}\n\n"
        "The token expires in 24 hours and can only be used once. If you did not create this account, ignore this email.",
    )


def send_password_reset_email(email: str, token: str) -> None:
    link_or_token = _action_link("PASSWORD_RESET_URL", token)
    send_email(
        email,
        "Reset your SkillGap AI password",
        "Reset your password using this link or token:\n\n"
        f"{link_or_token}\n\n"
        "This reset token expires in one hour and can only be used once. "
        "If you did not request this, you can ignore this message.",
    )


def send_email(recipient: str, subject: str, body: str) -> None:
    host = os.getenv("SMTP_HOST", "").strip()
    sender = os.getenv("SMTP_FROM_EMAIL", "").strip()
    if not host or not sender:
        raise RuntimeError("SMTP_HOST and SMTP_FROM_EMAIL must be configured to send authentication email.")

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)

    port = int(os.getenv("SMTP_PORT", "587"))
    timeout = float(os.getenv("SMTP_TIMEOUT_SECONDS", "10"))
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().lower() in {"1", "true", "yes", "on"}
    use_starttls = os.getenv("SMTP_STARTTLS", "true").strip().lower() in {"1", "true", "yes", "on"}

    if use_ssl:
        with smtplib.SMTP_SSL(host, port, timeout=timeout, context=ssl.create_default_context()) as server:
            if username:
                server.login(username, password)
            server.send_message(message)
        return

    with smtplib.SMTP(host, port, timeout=timeout) as server:
        if use_starttls:
            server.starttls(context=ssl.create_default_context())
        if username:
            server.login(username, password)
        server.send_message(message)
