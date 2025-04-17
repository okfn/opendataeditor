import PyInstaller.__main__
import os
import platform


def build_application():
    """Build an executable file for the Application."""
    system = platform.system()
    if system == "Darwin":  # macOS
        icon_path = "packaging/macos/icon.icns"
        app_name = "OpenDataEditor"
    elif system == "Windows":
        icon_path = "packaging/windows/icon.ico"
        app_name = "opendataeditor"
    elif system == "Linux":
        icon_path = "packaging/linux/icon.svg"
        app_name = "opendataeditor"

    print("Creating executable file for Open Data Editor")

    params = [
        "ode/main.py",
        "--windowed",  # Required for Windows install to not open a console.
        "--collect-all",
        "frictionless",  # Frictionless depends on data files
        "--collect-all",
        "ode",  # Collect all assets from Open Data Editor
        "--log-level",
        "WARN",
        "--name",
        app_name,
        "--noconfirm",
        "--icon",
        icon_path,
    ]

    if system == "Darwin":
        params.extend(["--osx-bundle-identifier", "org.okfn.opendataeditor"])

    PyInstaller.__main__.run(params)

    # Clean the spec file generated by PyInstaller
    if os.path.exists(f"{app_name}.spec"):
        os.remove(f"{app_name}.spec")


if __name__ == "__main__":
    build_application()
