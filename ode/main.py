import sys
import ode
import os
from enum import IntEnum

from typing import Callable

from pathlib import Path
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QTreeView,
    QPushButton,
    QLabel,
    QStackedLayout,
    QComboBox,
    QMenu,
    QMessageBox,
    QToolTip,
    QTextEdit,
    QSplitter,
)

from PySide6.QtGui import (
    QPixmap,
    QIcon,
    QDesktopServices,
    QAction,
    QFont,
    QPalette,
    QColor,
    QShortcut,
    QKeySequence,
    QKeyEvent,
)
from PySide6.QtCore import (
    Qt,
    QSize,
    QFileInfo,
    QTranslator,
    QFile,
    QTextStream,
    QThreadPool,
    Slot,
    Signal,
    QItemSelectionModel,
    QEvent,
    QModelIndex,
    QStandardPaths,
    QTimer,
)

# https://bugreports.qt.io/browse/PYSIDE-1914
from PySide6.QtWidgets import QFileSystemModel, QDialog

from ode import paths
from ode.dialogs.delete import DeleteDialog
from ode.dialogs.llm_dialog_warning import LLMWarningDialog
from ode.dialogs.loading import LoadingDialog
from ode.dialogs.cancel_ai_worker import CancelAIWorkerDialog
from ode.file import File
from ode.llama import LlamaDialog, LlamaDownloadDialog
from ode.paths import Paths
from ode.panels.errors import ErrorsWidget
from ode.panels.data import FrictionlessTableModel, DataWorker, DataViewer
from ode.panels.source import SourceViewer
from ode.dialogs.upload import DataUploadDialog
from ode.dialogs.rename import RenameDialog
from ode.dialogs.download import DownloadDialog
from ode.utils import migrate_metadata_store, setup_ode_internal_folders

from ode.log_setup import LOGS_PATH, configure_logging
import logging

import xlrd
import openpyxl

configure_logging()

logger = logging.getLogger(__name__)
logger.info("Starting Open Data Editor")


class ContentIndex(IntEnum):
    """Enum to represent the index of the content panels.
    They need to be added in this same order to match the stacked layout indices.
    """

    DATA = 0
    ERRORS = 1
    SOURCE = 2


class CustomTreeView(QTreeView):
    """An extended QTreeView to handle custom features for ODE.

    Currently we want the application to show a Welcome widget with an Upload Button
    whenever the user clicks on the empty space of the QTreeView.
    """

    empty_area_click = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)

        self.clicked.connect(self.item_clicked)

    def keyPressEvent(self, event: QKeyEvent):
        """Override keyPressEvent to handle expande/collapse folders."""
        if event.key() == Qt.Key_Return or event.key() == Qt.Key_Enter:
            index = self.currentIndex()
            model = self.model()
            if model and model.hasChildren(index):
                if self.isExpanded(index):
                    self.collapse(index)
                else:
                    self.expand(index)

        super().keyPressEvent(event)

    def mousePressEvent(self, event):
        """Emits an event if the user clicks on an empty space."""
        index = self.indexAt(event.position().toPoint())
        if not index.isValid():
            self.empty_area_click.emit()
        super().mousePressEvent(event)

    def viewportEvent(self, event):
        """
        Show a tooltip with the filename when hovering over a file in the file navigator.
        """
        if event.type() == QEvent.ToolTip:
            index = self.indexAt(event.pos())
            if index.isValid():
                global_pos = event.globalPos()
                file_path = self.model().filePath(index)
                filename = Path(file_path).name

                # We cannot change the QToolTip styles through the style.qss file
                font = QFont()
                font.setPointSize(14)
                QToolTip.setFont(font)

                palette = QToolTip.palette()
                palette.setColor(QPalette.ToolTipBase, QColor("#D6D6D6"))
                palette.setColor(QPalette.ToolTipText, QColor("#333333"))

                QToolTip.setPalette(palette)

                QToolTip.showText(global_pos, filename)

                # We return True to indicate that we handled the event and stop the propagation
                return True
        else:
            return super().viewportEvent(event)

    def item_clicked(self, index: QModelIndex):
        """
        Handle the click event of the QTreeView.
        If the item has children, we want to expand/collapse it when clicked.
        """
        model = self.model()
        if model and model.hasChildren(index):
            if self.isExpanded(index):
                self.collapse(index)
            else:
                self.expand(index)


class ClickableLabel(QLabel):
    """Add a click event to a QLabel.

    We want an interaction when the user clicks on the ODE logo of the sidebar.
    """

    clicked = Signal()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setFocusPolicy(Qt.StrongFocus)

    def mousePressEvent(self, event):
        self.clicked.emit()
        super().mousePressEvent(event)


class Sidebar(QWidget):
    """Widget containing the left sidebar of ODE.

    This class is responsible for:
     - Rendering all the components of the Sidebar.
     - All the logic of the context menu of the File Navigator.
    """

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()

        self.icon_label = ClickableLabel()
        pixmap = QPixmap(Paths.asset("logo.svg"))
        self.icon_label.setPixmap(pixmap)
        self.icon_label.setAlignment(Qt.AlignmentFlag.AlignLeft)

        self.button_upload = QPushButton(objectName="button_upload")

        self.file_navigator = CustomTreeView()

        self.file_model = QFileSystemModel()
        self.file_navigator.setModel(self.file_model)
        self.file_navigator.setRootIndex(self.file_model.setRootPath(str(paths.PROJECT_PATH)))
        self._show_only_name_column_in_file_navigator(self.file_model, self.file_navigator)
        self.file_navigator.setHeaderHidden(True)
        self.file_navigator.setContextMenuPolicy(Qt.CustomContextMenu)
        self.file_navigator.customContextMenuRequested.connect(self._show_context_menu)
        self._setup_file_navigator_context_menu()

        self.user_guide = QPushButton()
        self.user_guide.setIcon(QIcon(Paths.asset("icons/24/open-in-new.svg")))
        self.user_guide.setIconSize(QSize(20, 20))

        self.report_issue = QPushButton()
        self.report_issue.setIcon(QIcon(Paths.asset("icons/24/open-in-new.svg")))
        self.report_issue.setIconSize(QSize(20, 20))

        self.language = QComboBox()
        # We are changing since default SizeAdjustPolicy has a buggy behaviour with the Splitter.
        self.language.setSizeAdjustPolicy(QComboBox.SizeAdjustPolicy.AdjustToMinimumContentsLengthWithIcon)
        options = [
            ("English", ""),
            ("Français", "fr"),
            ("Español", "es"),
            ("Português", "pt"),
        ]
        language_icon = QIcon(Paths.asset("icons/24/language.svg"))
        for i, (text, locale) in enumerate(options):
            self.language.addItem(text)
            self.language.setItemData(i, locale)
            self.language.setItemIcon(i, language_icon)
        self.language.setStyleSheet("text-align: left;")

        layout.addWidget(self.icon_label)
        layout.addWidget(self.button_upload)
        layout.addWidget(self.file_navigator)
        layout.addWidget(self.user_guide)
        layout.addWidget(self.report_issue)
        layout.addWidget(self.language)

        self.setLayout(layout)

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.button_upload.setText(self.tr("Upload your data"))
        self.user_guide.setText(self.tr("User guide"))
        self.report_issue.setText(self.tr("Report an issue"))
        self.rename_action.setText(self.tr("Rename"))
        self.open_location_action.setText(self.tr("Open File in Location"))
        self.delete_action.setText(self.tr("Delete"))

    def _setup_file_navigator_context_menu(self):
        """Create the context menu for the file navigator."""
        self.context_menu = QMenu(self)

        self.rename_action = QAction()
        self.open_location_action = QAction()
        self.delete_action = QAction()

        self.rename_action.triggered.connect(self._rename_file_navigator_item)
        self.open_location_action.triggered.connect(self._open_file_navigator_location)
        self.delete_action.triggered.connect(self._delete_file_navitagor_item)

        self.context_menu.addAction(self.rename_action)
        self.context_menu.addAction(self.open_location_action)
        self.context_menu.addAction(self.delete_action)

    def _show_context_menu(self, position):
        """Show the context menu for a specific index at the specific position."""
        index = self.file_navigator.indexAt(position)
        if index.isValid():
            global_pos = self.file_navigator.viewport().mapToGlobal(position)
            self.context_menu.exec(global_pos)

    def _rename_file_navigator_item(self):
        """Ask user for the new name for the selected file/folder."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            file = File(self.file_model.filePath(index))
            name = file.path.stem
            dialog = RenameDialog(self, name)
            dialog.exec()

            new_name = dialog.result_text
            if new_name and new_name != name:
                try:
                    file.rename(new_name)
                except IsADirectoryError:
                    QMessageBox.warning(
                        self, self.tr("Error"), self.tr("Source is a file but destination a directory.")
                    )
                except NotADirectoryError:
                    QMessageBox.warning(
                        self, self.tr("Error"), self.tr("Source is a directory but destination a file.")
                    )
                except PermissionError:
                    # Since we have a managed PROJECT_PATH this should never happen.
                    QMessageBox.warning(self, self.tr("Error"), self.tr("Operation not permitted."))
                except OSError:
                    QMessageBox.warning(self, self.tr("Error"), self.tr("File with this name already exists."))
                else:
                    self.window().statusBar().showMessage(self.tr("Item renamed successfuly."))

    def _open_file_navigator_location(self):
        """Open the folder where the file lives using the OS application."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            path = self.file_model.filePath(index)
            if sys.platform == "win32":
                os.system(f'explorer.exe /select,"{Path(path)}"')
            elif sys.platform == "darwin":
                os.system(f'osascript -e \'tell application "Finder" to reveal (POSIX file "{path}")\'')
                os.system("osascript -e 'tell application \"Finder\" to activate'")
            else:
                cmd_run = f'dbus-send --dest=org.freedesktop.FileManager1 --type=method_call /org/freedesktop/FileManager1 org.freedesktop.FileManager1.ShowItems array:string:"{path}" string:""'
                os.system(cmd_run)

    def _delete_file_navitagor_item(self):
        """Delete a file/folder from the file navigator (and the OS)."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            file = File(self.file_model.filePath(index))
            is_selected = self.window().selected_file_path == file.path
            if DeleteDialog.confirm(self, file.path.name):
                try:
                    file.remove()
                except OSError as e:
                    QMessageBox.warning(self, self.tr("Error"), str(e))
                else:
                    if is_selected:
                        self.window().show_welcome_screen()
                    self.window().statusBar().showMessage(self.tr("Item deleted successfuly."))

    def _show_only_name_column_in_file_navigator(self, file_model, file_navigator):
        """Hide all columns except for the name column (column 0)"""
        for column in range(file_model.columnCount()):
            if column != 0:  # 0 is the name column
                file_navigator.setColumnHidden(column, True)


class ErrorsReportButton(QPushButton):
    """Toolbar button for the Errors Report that contains Icon, Text and ErrorCount.

    QPushButton (Icon+Text) is not enough since we need a three part button: Icon+Text+ErrorCount.
    In order for the ErrorCount Label to be part of the button (background, hover, clickable) we
    need to extend the basic QPushButton and override its layout and some methods.
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QHBoxLayout(self)
        self.layout.setSpacing(2)  # Aligns better with QPushButton look & feel
        self.layout.setContentsMargins(0, 0, 0, 0)

        self.icon_label = QLabel()
        self.icon_label.setFixedSize(20, 20)  # Match icon size
        self.layout.addWidget(self.icon_label)

        self.text_label = QLabel()
        self.layout.addWidget(self.text_label)

        self.error_label = QLabel()
        self.error_label.setProperty("error", True)  # For referencing in our style.qss file
        self.layout.addWidget(self.error_label)

        # This is some Qt Magic to properly display the button and of all its labels
        # (auto-expanding content-based width)
        self.layout.setSizeConstraint(QHBoxLayout.SetMinimumSize)

    def setText(self, text):
        self.text_label.setText(text)
        self.updateGeometry()  # Force layout recalc

    def setIcon(self, icon):
        """Overrides the QPushButton method to set the icon to our icon_label.

        A difference with QPushButton is that we handle the size here instead of calling
        QPushButton.setIconSize().
        """
        if icon.isNull():
            self.icon_label.clear()
        else:
            pixmap = icon.pixmap(QSize(20, 20))
            self.icon_label.setPixmap(pixmap)
        self.updateGeometry()

    def enable(self, number):
        """Enables the button and displays the error number.

        All children labels should also be enabled so we can use QSS pseudo-states for styling.
        """
        self.setEnabled(True)
        self.icon_label.setEnabled(True)
        self.text_label.setEnabled(True)
        self.error_label.setEnabled(True)
        if number <= 999:
            self.error_label.setText(str(number))
        else:
            self.error_label.setText("+999")
        self.error_label.show()
        self.updateGeometry()

    def disable(self):
        """Disables the button and hides the error number.

        Disabled button will have a grey color and no hover style. All children labels
        should also be disabled (so we can use QSS pseudo-states for styling)
        """
        self.setEnabled(False)
        self.icon_label.setEnabled(False)
        self.text_label.setEnabled(False)
        self.error_label.setEnabled(False)
        self.error_label.hide()
        self.updateGeometry()


class Toolbar(QWidget):
    """Widget containing ODE's toolbar.

    The toolbar contains:
     - Buttons that allow the user to navigate between the panels (Data, Metadata, Errors,
     Source, etc)
     - Buttons for the main actions like AI, Export and Save.
    """

    def __init__(self):
        super().__init__()
        layout = QHBoxLayout()

        # Buttons on the left
        # Setting the cursor to PointingHandCursor to indicate that the button is clickable because
        # is not working with the style.qss file.
        self.button_data = QPushButton(cursor=Qt.PointingHandCursor)
        self.button_errors = ErrorsReportButton()
        self.button_errors.setCursor(Qt.PointingHandCursor)
        self.button_errors.setIcon(QIcon(Paths.asset("icons/24/rule.svg")))
        self.button_source = QPushButton(cursor=Qt.PointingHandCursor)
        self.button_source.setIcon(QIcon(Paths.asset("icons/24/code.svg")))
        self.button_source.setIconSize(QSize(20, 20))
        layout.addWidget(self.button_data)
        layout.addWidget(self.button_errors)
        layout.addWidget(self.button_source)

        # Excel Sheet Selection
        self.excel_sheet_layout = QHBoxLayout()
        self.excel_sheet_container = QWidget()
        self.excel_sheet_label = QLabel(self.tr("Sheet:"))
        self.excel_sheet_label.setObjectName("excelSheetLabel")

        self.excel_sheet_combo = QComboBox()
        self.excel_sheet_combo.setObjectName("excelSheetCombo")

        self.excel_sheet_layout.addWidget(self.excel_sheet_label)
        self.excel_sheet_layout.addWidget(self.excel_sheet_combo)

        self.excel_sheet_container.setLayout(self.excel_sheet_layout)

        layout.addWidget(self.excel_sheet_container)

        # Spacer to push right-side buttons to the end
        layout.addStretch()

        # Buttons on the right
        self.button_ai = QPushButton(objectName="button_ai")
        self.button_ai.setIcon(QIcon(Paths.asset("icons/24/wand.svg")))
        self.button_ai.setIconSize(QSize(20, 20))
        self.button_ai.setFixedWidth(90)
        self.button_export = QPushButton(objectName="button_export")
        self.button_export.setIcon(QIcon(Paths.asset("icons/24/file-download.svg")))
        self.button_export.setIconSize(QSize(20, 20))
        self.button_export.setEnabled(False)
        self.button_save = QPushButton(objectName="button_save")
        self.button_save.setMinimumSize(QSize(117, 35))
        self.button_save.setIcon(QIcon(Paths.asset("icons/24/check.svg")))
        self.button_save.setIconSize(QSize(20, 20))
        self.button_save.setEnabled(False)
        # self.update_qss_button = QPushButton("QSS")
        # layout.addWidget(self.update_qss_button)
        layout.addWidget(self.button_ai)
        layout.addWidget(self.button_export)
        layout.addWidget(self.button_save)

        self.setLayout(layout)

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.button_data.setText(self.tr("Data"))
        self.button_errors.setText(self.tr("Errors Report"))
        self.button_source.setText(self.tr("Source code"))
        self.button_export.setText(self.tr("Export"))
        self.button_save.setText(self.tr("Save changes"))
        self.button_ai.setText(self.tr("AI"))


class Content(QWidget):
    """Widget to display the main section of the ODE.

    This widget represents the main content area of the Open Data Editor. If
    a file is selected, it will display the Toolbar and Panels. If no file is selected
    it will display a Welcoming widget with an upload button.
    """

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        layout.setSpacing(0)
        layout.setContentsMargins(0, 0, 0, 0)

        self.toolbar = Toolbar()
        layout.addWidget(self.toolbar)

        self.panels = QWidget(self)
        self.stacked_layout = QStackedLayout()
        self.panels.setLayout(self.stacked_layout)

        self.data_view = DataViewer()
        self.errors_view = ErrorsWidget()
        self.source_view = SourceViewer()
        self.ai_llama = LlamaDialog(self)

        self.stacked_layout.addWidget(self.data_view)  # ContentIndex.DATA = 0
        self.stacked_layout.addWidget(self.errors_view)  # ContentIndex.ERRORS = 1
        self.stacked_layout.addWidget(self.source_view)  # ContentIndex.SOURCE = 2

        layout.addWidget(self.panels)
        self.setLayout(layout)


class Welcome(QWidget):
    """Displays an Upload button when no files are selected."""

    def __init__(self):
        super().__init__()
        main_layout = QVBoxLayout()
        main_layout.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)

        image_label = QLabel(self)
        pixmap = QPixmap(Paths.asset("images/welcome_screen.png"))
        image_label.setPixmap(pixmap)
        image_label.setAlignment(Qt.AlignCenter)
        self.label_top = QLabel()
        self.label_top.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label_top.setStyleSheet("font-size: 14px; font-weight: 800;")
        self.button_upload = QPushButton()
        self.label_bottom = QLabel()
        self.label_bottom.setStyleSheet("font-size: 14px;")
        main_layout.addWidget(image_label)
        main_layout.addWidget(self.label_top)
        main_layout.addWidget(self.button_upload)
        main_layout.addWidget(self.label_bottom)

        self.setLayout(main_layout)
        self.retranslateUI()

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.label_top.setText(self.tr("The ODE supports Excel & csv files"))
        self.label_bottom.setText(self.tr("You can also add links to online tables"))
        self.button_upload.setText(self.tr("Upload your data"))


class MainWindow(QMainWindow):
    """Main Window of the Open Data Editor.

    This class is also the main Controller of the application with two reponsibilites:
     - Connect signals/slots of all widgets and elements (including children).
     - Handle custom logic that that requires children interactions with each other.

    The main window is composed by:
      - A Sidebar with the file navigator and buttons for several actions.
      - A Main area that can display two widgets:
        - A Welcome widget if no file is selected.
        - A Toolbar + Panel widgets if a file is selected.
    """

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Open Data Editor")
        icon = QIcon(Paths.asset("icons/icon.png"))
        self.setWindowIcon(icon)

        self.threadpool = QThreadPool()
        self.selected_file_path = Path()

        central_widget = QWidget(objectName="central_widget")
        layout = QHBoxLayout(central_widget)
        self.setCentralWidget(central_widget)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter)

        self.sidebar = Sidebar()

        self.main = QWidget()
        self.main_layout = QStackedLayout()
        self.welcome = Welcome()
        self.content = Content()
        self.main_layout.addWidget(self.welcome)
        self.main_layout.addWidget(self.content)
        self.main.setLayout(self.main_layout)

        splitter.addWidget(self.sidebar)
        splitter.addWidget(self.main)

        # Set splitter proportions (15% for sidebar)
        splitter.setSizes([int(self.width() * 0.15), int(self.width() * 0.85)])

        self._menu_bar()

        # Handle Slot/Signals
        self.sidebar.button_upload.clicked.connect(self.on_button_upload_click)
        self.welcome.button_upload.clicked.connect(self.on_button_upload_click)
        self.sidebar.file_navigator.clicked.connect(self.on_tree_click)
        self.sidebar.file_navigator.activated.connect(self.on_tree_click)
        self.sidebar.user_guide.clicked.connect(self.open_user_guide)
        self.sidebar.report_issue.clicked.connect(self.open_report_issue)
        self.sidebar.language.activated.connect(self.on_language_change)

        self.content.toolbar.button_export.clicked.connect(self.on_export_click)
        self.content.toolbar.button_save.clicked.connect(self.on_save_click)
        self.content.toolbar.button_ai.clicked.connect(self.on_ai_click)
        self.content.toolbar.button_data.clicked.connect(lambda: self.change_active_panel(ContentIndex.DATA))
        self.content.toolbar.button_errors.clicked.connect(lambda: self.change_active_panel(ContentIndex.ERRORS))
        self.content.toolbar.button_source.clicked.connect(lambda: self.change_active_panel(ContentIndex.SOURCE))

        self.content.toolbar.excel_sheet_combo.currentTextChanged.connect(self.on_excel_sheet_selection_changed)

        self.content.data_view.on_save.connect(self.on_data_view_save)

        self.sidebar.file_navigator.empty_area_click.connect(self.show_welcome_screen)
        self.sidebar.icon_label.clicked.connect(self.show_welcome_screen)

        # Shortcuts
        self.shortcut_f5 = QShortcut(QKeySequence("F5"), self)
        self.shortcut_f5.activated.connect(self.on_ai_click)

        # Data Panel
        self.shortcut_alt_d = QShortcut(QKeySequence(Qt.AltModifier | Qt.Key_D), self)
        self.shortcut_alt_d.activated.connect(lambda: self.change_active_panel(ContentIndex.DATA))

        # Errors Panel
        self.shortcut_alt_r = QShortcut(QKeySequence(Qt.AltModifier | Qt.Key_R), self)
        self.shortcut_alt_r.activated.connect(lambda: self.change_active_panel(ContentIndex.ERRORS))

        # Source Panel
        self.shortcut_alt_s = QShortcut(QKeySequence(Qt.AltModifier | Qt.Key_S), self)
        self.shortcut_alt_s.activated.connect(lambda: self.change_active_panel(ContentIndex.SOURCE))

        # Save
        if sys.platform == "darwin":
            self.shortcut_control_s = QShortcut(QKeySequence(Qt.MetaModifier | Qt.Key_S), self)
        else:
            self.shortcut_control_s = QShortcut(QKeySequence(Qt.ControlModifier | Qt.Key_S), self)

        self.shortcut_control_s.activated.connect(self.on_save_click)

        # Translation
        self.translator = QTranslator()
        self.retranslateUI()

        # self.content.toolbar.update_qss_button.clicked.connect(self.apply_stylesheet)
        self.apply_stylesheet()

        self._create_status_bar()

    def _create_status_bar(self):
        self.statusBar().showMessage(self.tr("Ready."))

    def _menu_bar(self):
        """Creates the menu bar and assign all its actions.

        Names and titles are going to be set in retranslateUI.
        """

        # File
        self.menu_file = QMenu()
        self.menu_file_add = QMenu()

        self.menu_file_add_action_upload_file = QAction()
        self.menu_file_add_action_upload_file.triggered.connect(self.upload_data)
        self.menu_file_add.addAction(self.menu_file_add_action_upload_file)

        self.menu_file_add_action_upload_external_url = QAction()
        self.menu_file_add_action_upload_external_url.triggered.connect(lambda: self.upload_data(external_first=True))
        self.menu_file_add.addAction(self.menu_file_add_action_upload_external_url)

        self.menu_file.addMenu(self.menu_file_add)
        self.menuBar().addMenu(self.menu_file)

        # View
        self.menu_view = QMenu()

        # By default is disabled because not file is selected
        self.menu_view.setEnabled(False)

        self.menu_view_action_errors_panel = QAction()
        self.menu_view_action_errors_panel.triggered.connect(lambda: self.change_active_panel(ContentIndex.ERRORS))
        self.menu_view.addAction(self.menu_view_action_errors_panel)

        self.menu_view_action_source_panel = QAction()
        self.menu_view_action_source_panel.triggered.connect(lambda: self.change_active_panel(ContentIndex.SOURCE))
        self.menu_view.addAction(self.menu_view_action_source_panel)

        self.menuBar().addMenu(self.menu_view)

        # Help
        self.menu_help = QMenu()
        self.menuBar().addMenu(self.menu_help)

        self.menu_help_action_user_guide = QAction()
        self.menu_help_action_user_guide.triggered.connect(self.open_user_guide)
        self.menu_help.addAction(self.menu_help_action_user_guide)

        self.menu_help_action_report_issue = QAction()
        self.menu_help_action_report_issue.triggered.connect(self.open_report_issue)
        self.menu_help.addAction(self.menu_help_action_report_issue)

        self.menu_help_action_show_logs = QAction()
        self.menu_help_action_show_logs.triggered.connect(self.show_logs_content)
        self.menu_help.addAction(self.menu_help_action_show_logs)

        self.menu_help_action_about = QAction()
        self.menu_help_action_about.triggered.connect(self.open_about_dialog)
        self.menu_help.addAction(self.menu_help_action_about)

    def apply_stylesheet(self):
        """Reads our main style QSS file and applies it to the application.

        Tip: this method can be connected to a button to live reload changes.
        """
        qss_file = QFile(Paths.asset("style.qss"))
        qss_file.open(QFile.ReadOnly)
        qss_content = QTextStream(qss_file).readAll()
        self.setStyleSheet(qss_content)

    @Slot()
    def show_welcome_screen(self):
        """Focus on the welcome screen and clear file navigator selection."""
        self.sidebar.file_navigator.selectionModel().clear()
        self.main_layout.setCurrentIndex(0)

        # No file is selected, disable the View menu
        self.menu_view.setEnabled(False)

    def on_export_click(self):
        """Handle the click on the Export button."""
        # TODO: we are using a proxy variable to check if the file has errors. We should find a
        # better state variable for it.
        has_errors = self.content.toolbar.button_errors.isEnabled()
        download_dialog = DownloadDialog(self, self.selected_file_path, has_errors)
        download_dialog.download_data_with_errors.connect(self.on_download_error_file)
        download_dialog.show()

    def on_data_changed(self):
        """Action that enables the Save Button."""
        self.content.toolbar.button_save.setEnabled(True)

    def on_ai_click(self):
        """Handle the click on the AI button."""

        if self.content.ai_llama.isMinimized():
            self.content.ai_llama.showNormal()
            return

        if not LLMWarningDialog.confirm(self):
            return

        ai_llama_download = LlamaDownloadDialog(self)
        if ai_llama_download.exec() == QDialog.Accepted:
            selected_model = ai_llama_download.selected_model_path
            if selected_model:
                self.content.ai_llama.init_llm(selected_model)
                self.content.ai_llama.show()

    def change_active_panel(self, panel_index: ContentIndex):
        """Change the active panel in the content area and highlight its toolbar button.

        This method changes the active panel in the content area based on the
        provided panel index and sets the "active" property of the related button in the
        toolbar.
        """
        if panel_index < 0 or panel_index >= self.content.stacked_layout.count():
            raise ValueError("Invalid panel index.")

        self.content.stacked_layout.setCurrentIndex(panel_index)

        buttons = [
            self.content.toolbar.button_data,  # ContentIndex.DATA = 0
            self.content.toolbar.button_errors,  # ContentIndex.ERRORS = 1
            self.content.toolbar.button_source,  # ContentIndex.SOURCE = 2
        ]

        for i, button in enumerate(buttons):
            button.setProperty("active", i == panel_index)
            button.style().polish(button)  # Force the button to update its style

        # For the Errors label we need to check if it is enabled and update its style
        # to hide the error label styles if we are in the Errors panel.
        button_error_label = self.content.toolbar.button_errors.error_label
        hide_styles_for_error_label = panel_index != ContentIndex.ERRORS
        button_error_label.setProperty("error", hide_styles_for_error_label)
        button_error_label.style().polish(button_error_label)

    def retranslateUI(self):
        """Set the text of all the UI elements using a translation function.

        retranslateUI is a pattern used in Qt to handle the dynamic updates
        of languages. All text that needs to be translated needs to be set inside
        this function so we can call it to refresh the UI.

        This method should be call when:
          a) The application is load for the first time (MainWindow.__init__)
          b) Every time the user selects a different language (language ComboBox)
          c) An event related to language change is fired (like the user changing
          the language in the OS. Not Implemented yet).
        """
        # Update translated text for menus

        # File menu
        self.menu_file.setTitle(self.tr("File"))
        self.menu_file_add.setTitle(self.tr("Add"))
        self.menu_file_add_action_upload_file.setText(self.tr("File/Folder"))
        self.menu_file_add_action_upload_external_url.setText(self.tr("External URL"))

        # View
        self.menu_view.setTitle(self.tr("View"))
        self.menu_view_action_errors_panel.setText(self.tr("Errors panel"))
        self.menu_view_action_source_panel.setText(self.tr("Source panel"))

        # Help
        self.menu_help.setTitle(self.tr("Help"))
        self.menu_help_action_user_guide.setText(self.tr("User Guide"))
        self.menu_help_action_report_issue.setText(self.tr("Report an Issue"))
        self.menu_help_action_show_logs.setText(self.tr("View logs"))
        self.menu_help_action_about.setText(self.tr("About"))

        # Hook retranslateUI for main widgets
        self.sidebar.retranslateUI()
        self.welcome.retranslateUI()
        self.content.toolbar.retranslateUI()

        # Hook retranslateUI for all panels (data, errors, metadata, etc)
        self.content.data_view.retranslateUI()
        self.content.errors_view.retranslateUI()
        self.content.source_view.retranslateUI()
        self.content.ai_llama.retranslateUI()

        self.excel_sheet_name = None

    def on_language_change(self, index):
        """Gets a *.qm translation file and calls retranslateUI.

        Translation files are generated using Qt tools pyside6-lupdate and
        pyside6-lrelease.
        """
        locale = self.sidebar.language.itemData(index)
        app = QApplication.instance()
        if not locale:
            app.removeTranslator(self.translator)
            self.retranslateUI()
            return

        filename = locale + ".qm"
        filepath = Paths.translation(filename)
        if self.translator.load(filepath):
            app.installTranslator(self.translator)
        else:
            print(f"Error when loading {filepath} translator file. Fallbacking to English.")
            app.removeTranslator(self.translator)
        self.retranslateUI()
        self.statusBar().showMessage(self.tr("Language changed."))

    def upload_data(self, external_first=False):
        """Copy data file to the project folder of ode.

        After successful upload the file should be selected, validated, and displayed.
        """
        dialog = DataUploadDialog(self, external_first=external_first)

        ok, path = dialog.upload_dialog()
        if ok and path:
            self.selected_file_path = path
            # Calling file_model.index() has a weird side-effect in the QTreeView that will display the new
            # uploaded file at the end of the list instead of the default alphabetical order.
            self.excel_sheet_name = None
            index = self.sidebar.file_model.index(str(path))
            self.sidebar.file_navigator.selectionModel().select(index, QItemSelectionModel.SelectionFlag.ClearAndSelect)
            self.read_validate_and_display_file(path)

    def on_button_upload_click(self):
        self.upload_data()

    def on_save_click(self):
        """Saves changes made in the Table View into the file."""
        self.table_model.write_data(self.selected_file_path, sheet_name=self.excel_sheet_name)
        # TODO: Since the file is already in memory we should only validate/display to avoid unecessary tasks.
        self.read_validate_and_display_file(self.selected_file_path)
        self.statusBar().showMessage(self.tr("File and Metadata changes saved."))

    def on_data_view_save(self, save_data):
        """
        Reloads the file and updates the views. when is saved in the data view
        """
        if save_data:
            self.table_model.write_data(self.selected_file_path, sheet_name=self.excel_sheet_name)

        self.read_validate_and_display_file(self.selected_file_path)

    @Slot(tuple)
    def update_views(self, worker_data):
        """Update all the main views with the data provided by the read worker.

        This method is connected to the data widget Worker's signal and it will
        receive the data, the frictionless report and a list of errors.
        """
        filepath, data, errors = worker_data
        self.table_model = FrictionlessTableModel(data, errors)
        self.table_model.dataChanged.connect(self.on_data_changed)
        self.content.data_view.display_data(self.table_model, filepath, sheet_name=self.excel_sheet_name)
        self.content.errors_view.display_errors(errors, self.table_model)
        self.content.source_view.open_file(filepath)
        self.content.ai_llama.set_data(data)

        self.update_excel_sheet_dropdown(filepath)

        # Always focus back to the data view.
        self.main_layout.setCurrentIndex(1)
        self.change_active_panel(ContentIndex.DATA)

    def get_sheets_names(self, filepath: Path) -> list[str]:
        """Get the names of the sheets in an Excel file."""
        sheet_names = []
        if filepath.suffix == ".xls":
            workbook = xlrd.open_workbook(filepath)
            sheet_names = workbook.sheet_names()
        elif filepath.suffix in [".xlsx"]:
            workbook = openpyxl.load_workbook(filepath, read_only=True)
            sheet_names = workbook.sheetnames

        return sheet_names

    def update_excel_sheet_dropdown(self, filepath):
        """
        Update the Excel sheet dropdown with the names of the sheets in the selected file.
        If there are no sheets, the dropdown and label will be hidden.
        """
        self.content.toolbar.excel_sheet_combo.blockSignals(True)

        self.content.toolbar.excel_sheet_combo.clear()

        sheet_names = self.get_sheets_names(filepath)

        if sheet_names and len(sheet_names) > 1:
            if self.excel_sheet_name is None:
                self.excel_sheet_name = sheet_names[0]

            self.content.toolbar.excel_sheet_combo.addItems(sheet_names)
            self.content.toolbar.excel_sheet_combo.setCurrentText(self.excel_sheet_name)
            self.content.toolbar.excel_sheet_container.setVisible(True)
        else:
            self.content.toolbar.excel_sheet_container.setVisible(False)
            self.excel_sheet_name = None

        self.content.toolbar.excel_sheet_combo.blockSignals(False)

    def on_excel_sheet_selection_changed(self, sheet_name: str):
        """
        Handle the change of the selected Excel sheet in the dropdown.
        Reloads the file with the selected sheet name and updates the views.
        """
        if self.selected_file_path.suffix in [".xls", ".xlsx"]:
            self.excel_sheet_name = sheet_name
            self.read_validate_and_display_file(self.selected_file_path)
        else:
            raise ValueError("Selected file is not an Excel file.")

    @Slot(tuple)
    def update_toolbar(self, worker_data):
        """
        Updates the toolbar based on the data provided by the read worker.

        This method is connected to the data widget Worker's signal and it will
        receive the data, the frictionless report and a list of errors.
        """
        _, _, errors = worker_data
        errors_count = len(errors)

        # If we don't have errors we don't enable the Errors Report tab.
        if errors_count == 0:
            self.content.toolbar.button_errors.disable()
        else:
            self.content.toolbar.button_errors.enable(errors_count)

        # Save button should be disabled everytime we load and display a new file.
        self.content.toolbar.button_save.setEnabled(False)

    @Slot(tuple)
    def update_menu_bar(self, worker_data):
        """
        Updates the menu bar based on the data provided by the read worker.

        This method is connected to the data widget Worker's signal and it will
        receive the data, the frictionless report and a list of errors.
        """
        self.menu_view.setEnabled(True)

        _, _, errors = worker_data
        errors_count = len(errors)

        if errors_count == 0:
            self.menu_view_action_errors_panel.setEnabled(False)
        else:
            self.menu_view_action_errors_panel.setEnabled(True)

    def read_validate_and_display_file(self, file_path, fn_callback: Callable | None = None):
        """Reads a file, validates it and refresh the whole UI.
        This method is called when the user selects a file in our QTreeView but there could
        be other workflows in the application that will require this logic (like Uploading a File).

        It will create a Worker to read data in the background and display a ProgressDialog if it
        is taking too long. Reading with a worker is a requirement to display a proper QProgressDialog.

        Args:
            file_path (Path): The path to the file to read.
            fn_finished (Callable, optional): A function to call when the worker finishes. Defaults to None.
                It cannot be a lambda function since it will not be picked and sent to the worker thread.
        """
        info = QFileInfo(file_path)
        if info.isFile() and info.suffix() in ["csv", "xls", "xlsx"]:
            self.loading_dialog = LoadingDialog(self)

            worker = DataWorker(file_path, self.excel_sheet_name)
            worker.signals.finished.connect(self.update_views)
            worker.signals.finished.connect(self.update_toolbar)
            worker.signals.finished.connect(self.update_menu_bar)
            worker.signals.finished.connect(self.loading_dialog.close)
            worker.signals.finished.connect(self.loading_dialog.cancel_loading_timer)

            if fn_callback:
                worker.signals.finished.connect(fn_callback)

            worker.signals.messages.connect(self.statusBar().showMessage)
            worker.signals.messages.connect(self.loading_dialog.show_message)

            self.threadpool.start(worker)
            self.loading_dialog.show()

    def on_tree_click(self, index):
        """Handles the click action of our File Navigator."""
        if self.content.ai_llama.worker and self.content.ai_llama.worker.isRunning():
            ok = CancelAIWorkerDialog.confirm(self)
            if not ok:
                return
            self.content.ai_llama.close()

        self.selected_file_path = Path(self.sidebar.file_model.filePath(index))
        if self.selected_file_path.is_file():
            # Reset the excel sheet name to None to avoid displaying the previous file's sheet
            self.excel_sheet_name = None
            self.read_validate_and_display_file(self.selected_file_path)
            self.content.toolbar.button_export.setEnabled(True)
        else:
            self.content.toolbar.button_export.setEnabled(False)

    def open_about_dialog(self):
        text = f"Version: {ode.__version__}<br><a href='https://opendataeditor.okfn.org'>Website</a>"
        QMessageBox.about(self, "Open Data Editor", text)

    def open_user_guide(self):
        QDesktopServices.openUrl("https://opendataeditor.okfn.org/documentation/welcome")

    def open_report_issue(self):
        QDesktopServices.openUrl("https://github.com/okfn/opendataeditor")

    # Then define the function that will be executed when the action is triggered
    def show_logs_content(self):
        file_path = LOGS_PATH / "info.log"

        try:
            # Read only the last 40 lines of the file
            with open(file_path, "r", encoding="utf-8") as file:
                # Read all lines and store in a list
                all_lines = file.readlines()
                # Get the last 40 lines (or all if less than 40)
                last_lines = all_lines[-100:] if len(all_lines) > 40 else all_lines
                # Join the lines into a single string
                content = "".join(last_lines)

            # Create a dialog to show the content
            dialog = QDialog(self)
            dialog.setWindowTitle(self.tr("Last 100 Lines"))
            dialog.resize(900, 500)

            # Create a layout for the dialog
            layout = QVBoxLayout(dialog)

            # Create a text widget to display the content
            text_edit = QTextEdit()
            font = QFont("Courier New")
            font.setStyleHint(QFont.Monospace)
            text_edit.setFont(font)
            text_edit.setReadOnly(True)
            text_edit.setText(content)

            layout.addWidget(text_edit)

            # Create a horizontal layout for buttons
            button_layout = QHBoxLayout()

            # Close button
            close_button = QPushButton(self.tr("Close"))
            close_button.clicked.connect(dialog.close)
            button_layout.addWidget(close_button)

            # Copy button
            copy_button = QPushButton(self.tr("Copy to Clipboard"))
            copy_button.clicked.connect(lambda: QApplication.clipboard().setText(text_edit.toPlainText()))
            button_layout.addWidget(copy_button)

            layout.addLayout(button_layout)

            # Show the dialog
            dialog.exec()

        except Exception as e:
            QMessageBox.critical(self, "Error", f"Could not open file: {str(e)}")

    def on_download_error_file(self):
        """
        Downloads the file with errors to the user's Downloads folder.
        """
        self.table_model.finished.connect(self.loading_dialog.close)
        self.table_model.finished.connect(self.loading_dialog.cancel_loading_timer)
        self.loading_dialog.show_message(self.tr("Downloading data with errors..."))
        # We are showing the dialog instantly without waiting the 300ms delay
        self.loading_dialog.show(0)

        # We use QTimer to ensure the download is performed after the dialog is shown
        QTimer.singleShot(100, self._perform_download)

    def _perform_download(self):
        """
        Performs the actual download of the file with errors to the user's Downloads folder.
        """
        downloads_path = QStandardPaths.writableLocation(QStandardPaths.DownloadLocation)
        filename = self.selected_file_path.name
        # TODO: do no overwrite existing files
        filepath = Path(downloads_path, filename)
        filepath = filepath.with_stem(f"{filepath.stem}_errors").with_suffix(".xlsx")
        self.table_model.write_error_xlsx(filepath)

        success_text = self.tr("File downloaded successfully to:\n{}").format(filepath)
        QMessageBox.information(self, self.tr("Success"), success_text)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setApplicationName("Open Data Editor")
    app.setApplicationVersion(ode.__version__)
    app.setStyle("Fusion")

    # Migration to ODE 1.4
    migrate_metadata_store()

    setup_ode_internal_folders()

    window = MainWindow()
    window.showMaximized()
    window.show()
    sys.exit(app.exec())
