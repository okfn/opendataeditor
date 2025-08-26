import sys
import os
from pathlib import Path
from typing import NamedTuple
import logging

from llama_cpp import Llama as LlamaCPP
from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QTextEdit,
    QPushButton,
    QLabel,
    QListWidget,
    QHBoxLayout,
    QMessageBox,
    QProgressDialog,
    QListWidgetItem,
)
from PySide6.QtCore import QThread, Signal, QObject, QSaveFile, QIODevice, Slot, Qt
from PySide6.QtNetwork import QNetworkReply, QNetworkRequest, QNetworkAccessManager

from ode.dialogs.loading import LoadingDialog
from ode.paths import AI_MODELS_PATH

if not os.path.exists(AI_MODELS_PATH):
    os.makedirs(AI_MODELS_PATH)

logger = logging.getLogger(__name__)


class AIModel(NamedTuple):
    """Data structure to hold AI model information."""

    name: str
    url: str
    filename: str


AI_MODELS = [
    AIModel(
        name="Llama 3.2 3B (2.0GB)",
        url="https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf?download=true",
        filename="Llama-3.2-3B-Instruct-Q4_K_M.gguf",
    ),
    AIModel(
        name="Qwen 2.5 7B (4.7GB)",
        url="https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf?download=true",
        filename="Qwen2.5-7B-Instruct-Q4_K_M.gguf",
    ),
]


class Llama:
    """Wrapper for the Llama model using llama_cpp."""

    def __init__(self, model_path):
        self.model = LlamaCPP(model_path=model_path, n_ctx=4096)

    def __call__(self, prompt):
        response = self.model(prompt, temperature=0.2, max_tokens=2048)
        return response


class LlamaWorkerSignals(QObject):
    """Define the signals for the LlamaWorker."""

    finished = Signal(tuple)
    messages = Signal(str)


class LlamaWorker(QThread):
    """
    LlamaWorker is a QThread that processes a prompt using the LLM.
    """

    def __init__(self, llm, prompt):
        super().__init__()
        self.llm = llm
        self.prompt = prompt
        self.signals = LlamaWorkerSignals()

    def run(self):
        try:
            self.signals.messages.emit(self.tr("This could take a few minutes. Please wait..."))
            response = self.llm(self.prompt)
            self.signals.finished.emit(response["choices"][0]["text"])
        except Exception:
            logger.error("Error during LLM processing", exc_info=True)
            self.signals.finished.emit(self.tr("Execution failed"))


class LlamaDialog(QDialog):
    """
    Dialog for interacting with the LLM.
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.llm = None
        self.worker = None
        self.init_ui()

        self.loading_dialog = LoadingDialog(self)
        self.data = None

    def closeEvent(self, event):
        """Handle the close event to clear the output text."""
        self.output_text.clear()
        event.accept()
        super().closeEvent(event)

    def init_ui(self):
        """Initialize the UI for the Llama dialog."""
        layout = QVBoxLayout(self)

        self.prompt_label = QLabel("Prompt:")
        layout.addWidget(self.prompt_label)

        self.input_text = QTextEdit()
        self.input_text.setMinimumHeight(300)
        self.input_text.setMinimumWidth(700)
        layout.addWidget(self.input_text)

        self.btn_run = QPushButton()
        self.btn_run.clicked.connect(self.run)
        layout.addWidget(self.btn_run)

        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setMinimumHeight(300)
        self.output_text.setMinimumWidth(700)
        layout.addWidget(self.output_text)

        self.retranslateUI()

    def set_data(self, data):
        """Set the data for analysis."""
        self.data = data

        headers = [str(h) for h in self.data[0] if h is not None and h != ""]
        prompt = f"""Column headers: {" | ".join(headers)}

        Using the following rules, suggest better names for unclear or incorrect column names:
        Rule 1: always use lowercase letters for column names.
        Rule 2: always use underscore to separate words, never user spaces.
        Rule 3: names should be descriptive about the content of the column and coherent with the topic of other columns.
        Rule 4: never user more than 3 words for column names.

        If current column names apply to these rules you can flag them as correct name instead of suggesting a new one.

        Just return the list of changes and it's explanation (if required), do not add any other information to the output.
        """

        self.input_text.setText(prompt)

    def init_llm(self, model_path):
        """Initialize the LLM with the given model path."""
        self.llm = Llama(model_path=model_path)

    def run(self):
        if self.llm is None or self.data is None:
            return

        self.worker = LlamaWorker(self.llm, self.input_text.toPlainText())
        self.worker.signals.finished.connect(self.on_execution_finished)
        self.worker.signals.messages.connect(self.loading_dialog.show_message)
        self.worker.signals.finished.connect(self.loading_dialog.close)
        self.worker.start()

        self.loading_dialog.show()

    def on_execution_finished(self, result):
        """Handle the result of the table analysis."""
        self.output_text.setMarkdown(result)

    def retranslateUI(self):
        """Retranslate the UI elements."""
        self.setWindowTitle(self.tr("AI feature"))
        self.btn_run.setText(self.tr("Execute"))
        self.output_text.setPlaceholderText(self.tr("Results will be displayed here..."))


class LlamaDownloadDialog(QDialog):
    """Dialog for downloading and selecting LLama models.

    Based on: https://doc.qt.io/qtforpython-6/examples/example_network_downloader.html
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.manager = QNetworkAccessManager(self)
        self.selected_model_path = None
        self.download_file_path = None
        self.file = None
        self.reply = None
        self.progress_dialog = None
        self.init_ui()

    def init_ui(self):
        """Initialize the UI for the Llama download dialog."""
        self.setWindowTitle(self.tr("AI feature"))

        layout = QVBoxLayout(self)

        label_models = QLabel(self.tr("To start using the AI feature, please select one of the following models."))
        layout.addWidget(label_models)

        label_download_location = QLabel(
            self.tr(
                f'The ODE will save the file in this location: <i><a href="file://{AI_MODELS_PATH}">{AI_MODELS_PATH}</a></i>'
            )
        )
        label_download_location.setTextFormat(Qt.RichText)
        label_download_location.setTextInteractionFlags(Qt.TextBrowserInteraction)
        label_download_location.linkActivated.connect(self.open_download_directory)

        layout.addWidget(label_download_location)

        self.model_list = QListWidget()
        self.model_list.setMinimumHeight(200)
        self.model_list.itemSelectionChanged.connect(self.on_selection_changed)
        layout.addWidget(self.model_list)
        self.fill_model_list()

        # Download Section
        download_layout = QHBoxLayout()

        self.btn_delete = QPushButton(self.tr("Delete"))
        self.btn_delete.clicked.connect(self.on_delete_model)
        download_layout.addWidget(self.btn_delete)

        self.btn_download = QPushButton(self.tr("Download"))
        self.btn_download.clicked.connect(self.on_download_model)
        download_layout.addWidget(self.btn_download)

        self.btn_select = QPushButton(self.tr("Select Model"))
        self.btn_select.clicked.connect(self.on_select_model)
        download_layout.addWidget(self.btn_select)

        layout.addLayout(download_layout)

    def on_selection_changed(self):
        """Enable or disable buttons based on the selection in the model list."""
        model_selected = self.get_selected_model()
        if not model_selected:
            return None

        downloaded_models_filenames = self.get_downloaded_models()
        disabled_style = "QPushButton:disabled { color: gray; }"

        if model_selected.filename in downloaded_models_filenames:
            self.btn_download.setEnabled(False)
            self.btn_download.setStyleSheet(disabled_style)
            self.btn_delete.setEnabled(True)
            self.btn_select.setEnabled(True)
        else:
            self.btn_download.setEnabled(True)
            self.btn_delete.setEnabled(False)
            self.btn_delete.setStyleSheet(disabled_style)
            self.btn_select.setEnabled(False)
            self.btn_select.setStyleSheet(disabled_style)

    def on_select_model(self):
        """Select the model from the list and close the dialog."""
        model_selected = self.get_selected_model()

        if not model_selected:
            QMessageBox.warning(self, self.tr("Model not found"), self.tr("Please select one of the models"))
            return

        model_path = os.path.join(AI_MODELS_PATH, model_selected.filename)
        if not os.path.exists(model_path):
            QMessageBox.warning(self, self.tr("Model not found"), self.tr("Please select one of the models"))
            return

        self.selected_model_path = model_path
        self.accept()

    def fill_model_list(self):
        """Fill the model list with available models and downloaded models."""

        self.model_list.clear()
        downloaded_models_filenames = self.get_downloaded_models()
        for model in AI_MODELS:
            item = QListWidgetItem()

            if model.filename in downloaded_models_filenames:
                item.setText(f"{model.name} / Downloaded")
            else:
                item.setText(f"{model.name} / Not downloaded")

            self.model_list.addItem(item)

    def get_downloaded_models(self):
        """Retrieve the list of downloaded models from the AI_MODELS_PATH directory."""
        downloaded_models = set()

        for filename in os.listdir(AI_MODELS_PATH):
            if filename.startswith("."):
                continue

            downloaded_models.add(filename)

        return downloaded_models

    def get_selected_model(self):
        """Get the selected model from the model list."""
        selected_items = self.model_list.selectedItems()
        if not selected_items:
            return None

        model_name = selected_items[0].text().split("/")[0].strip()
        model_selected = None
        for model in AI_MODELS:
            if model.name == model_name:
                model_selected = model
                break

        return model_selected

    def open_download_directory(self):
        """Open the directory where models are downloaded."""
        path = str(AI_MODELS_PATH)
        if sys.platform == "win32":
            os.system(f'explorer.exe /select,"{Path(path)}"')
        elif sys.platform == "darwin":
            os.system(f'osascript -e \'tell application "Finder" to reveal (POSIX file "{path}")\'')
            os.system("osascript -e 'tell application \"Finder\" to activate'")
        else:
            cmd_run = f'dbus-send --dest=org.freedesktop.FileManager1 --type=method_call /org/freedesktop/FileManager1 org.freedesktop.FileManager1.ShowItems array:string:"{path}" string:""'
            os.system(cmd_run)

    @Slot()
    def on_download_model(self):
        """Download the selected model."""
        model_selected = self.get_selected_model()
        if not model_selected:
            return

        self.download_file_path = AI_MODELS_PATH / f"{model_selected.filename}"

        if self.download_file_path.exists():
            ret = QMessageBox.question(
                self,
                self.tr("File exists"),
                self.tr("Do you want to delete it and download it again?"),
                QMessageBox.Yes | QMessageBox.No,
            )
            if ret == QMessageBox.No:
                return
            self.download_file_path.unlink()

        self.btn_download.setDisabled(True)

        # Create the file in write mode to append bytes
        self.file = QSaveFile(str(self.download_file_path))

        if self.file.open(QIODevice.OpenModeFlag.WriteOnly):
            self.reply = self.manager.get(QNetworkRequest(model_selected.url))

            self.progress_dialog = QProgressDialog(self.tr("Downloading model"), self.tr("Cancel"), 0, 0, self)
            self.progress_dialog.setWindowTitle(self.tr("LLM Model Download Progress"))
            self.progress_dialog.setAutoClose(True)
            self.progress_dialog.setWindowModality(Qt.WindowModality.WindowModal)
            self.progress_dialog.canceled.connect(self.on_download_abort)

            self.reply.downloadProgress.connect(self.on_download_progress)
            self.reply.finished.connect(self.on_download_finished)
            self.reply.readyRead.connect(self.on_download_ready_read)
            self.reply.errorOccurred.connect(self.on_download_error)
        else:
            error = self.file.errorString()
            QMessageBox.warning(self, self.tr("Error Occurred"), error)

    @Slot()
    def on_delete_model(self):
        """Delete the selected model file."""
        model_selected = self.get_selected_model()
        download_file_path = AI_MODELS_PATH / f"{model_selected.filename}"
        download_file_path.unlink(missing_ok=True)
        self.fill_model_list()

    @Slot()
    def on_download_abort(self):
        """When user press abort button"""
        if self.reply:
            self.reply.abort()
        if self.file:
            self.file.cancelWriting()
            # cancelWriting should delete the file but it doesn't seems to be happening.
            if self.download_file_path.exists():
                self.download_file_path.unlink()

        self.btn_download.setDisabled(False)

    @Slot()
    def on_download_finished(self):
        """Handle the completion of the download."""
        if self.reply:
            self.reply.deleteLater()

        if self.file:
            self.file.commit()

        self.btn_download.setEnabled(True)
        self.btn_download.setText(self.tr("Download"))
        self.fill_model_list()

    @Slot()
    def on_download_ready_read(self):
        """Get available bytes and store them into the file"""
        if self.reply:
            if self.reply.error() == QNetworkReply.NetworkError.NoError:
                self.file.write(self.reply.readAll())

    @Slot(int, int)
    def on_download_progress(self, bytesReceived: int, bytesTotal: int):
        """Update progress bar"""

        if self.reply.isOpen() and bytesTotal > 0:
            # Percentage progress
            self.progress_dialog.setMaximum(100)
            percentage = int((bytesReceived / bytesTotal) * 100)
            self.progress_dialog.setValue(percentage)
            text = f"{self.format_size(bytesReceived)} / {self.format_size(bytesTotal)}"
            self.progress_dialog.setLabelText(text)

    @Slot(QNetworkReply.NetworkError)
    def on_download_error(self, code: QNetworkReply.NetworkError):
        """Show a message if an error happen"""
        if self.reply:
            QMessageBox.warning(self, self.tr("Error Occurred"), self.reply.errorString())
        self.progress_dialog = None

    @staticmethod
    def format_size(bytes_size: int) -> str:
        # Convert bytes to human-readable format
        for unit in ["B", "KB", "MB", "GB"]:
            if bytes_size < 1024.0:
                return f"{bytes_size:.2f} {unit}"
            bytes_size /= 1024.0
        return f"{bytes_size:.2f} TB"
