import logging
import sys
from logging.handlers import RotatingFileHandler

from PySide6.QtCore import QtMsgType, qInstallMessageHandler

from ode import utils
from ode.paths import LOGS_PATH


def configure_logging():
    """Configure logging for the application."""
    # Create the logs directory if it doesn't exist
    LOGS_PATH.mkdir(parents=True, exist_ok=True)

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    # Clear any existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

    # File handler for logging errors
    file_handler = RotatingFileHandler(
        LOGS_PATH / "errors.log",
        maxBytes=5 * 1024 * 1024,  # 5MB (5 * 1024 * 1024 bytes)
        backupCount=3,  # 5MB,  Keep 3 backup files
    )
    file_handler.setLevel(logging.ERROR)
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    # Console handler for logging info
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # Configure the handler for non handled exceptions
    configure_exception_handling(root_logger)

    return root_logger


def configure_exception_handling(logger):
    """Configure exception handling to log uncaught exceptions."""

    # This will always be called when an exception is raised and not handled by the application
    # The only downside is that it will be executed even if the exception is handled in another thread.
    def exception_hook(exctype, value, traceback):
        logger.error(f"{exctype.__name__}: {value}", exc_info=(exctype, value, traceback))
        utils.show_error_dialog(
            message=f"An unexpected error occurred: {exctype.__name__}: {value}",
            title="Error",
        )
        sys._excepthook(exctype, value, traceback)

    # Replace the default exception hook with our custom one
    # This is necessary to ensure that the original exception hook is called
    sys._excepthook = sys.excepthook
    sys.excepthook = exception_hook

    # Set up logging for PyQt/PySide
    def qt_message_handler(msg_type, context, message):
        if msg_type == QtMsgType.QtFatalMsg or msg_type == QtMsgType.QtCriticalMsg:
            logger.error(f"Qt Error: {message}")

    qInstallMessageHandler(qt_message_handler)


def get_module_logger(module_name):
    """et a logger for a specific module."""
    return logging.getLogger(module_name)
