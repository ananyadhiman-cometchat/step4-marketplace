"""Lightweight import-level smoke test — no database needed."""


def test_app_imports():
    from app.main import app  # noqa: F401
    assert app is not None


def test_settings_import():
    from app.core.config import settings  # noqa: F401
    assert settings.JWT_ALGORITHM == "HS256"


def test_security():
    from app.core.security import hash_password, verify_password

    hashed = hash_password("TestPass1!")
    assert verify_password("TestPass1!", hashed)
    assert not verify_password("wrong", hashed)
