import os

from llama_cpp import Llama as LlamaCPP
from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QTextEdit,
    QPushButton,
    QLabel,
    QListWidget,
    QHBoxLayout,
    QComboBox,
    QMessageBox,
    QProgressDialog,
)
from PySide6.QtCore import QThread, Signal, QObject
from PySide6.QtCore import QSaveFile, QIODevice, Slot, Qt
from PySide6.QtNetwork import QNetworkReply, QNetworkRequest, QNetworkAccessManager

from ode.dialogs.loading import LoadingDialog
from ode.paths import AI_MODELS_PATH

AI_MODELS = {
    "Llama 3.2 3B Instruct (Q4_K_M)": "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf?download=true",
    "Qwen 2.5 7B Instruct (Q4_K_M)": "https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf?download=true",
}


class Llama:
    """Wrapper for the Llama model using llama_cpp."""

    def __init__(self, model_path):
        self.model = LlamaCPP(model_path=model_path, n_ctx=4096)

    def __call__(self, prompt):
        response = self.model(prompt, temperature=0.2, max_tokens=2048)
        return response


class DataWorkerSignals(QObject):
    """Define the signals for the DataWorker."""

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
        self.signals = DataWorkerSignals()

    def run(self):
        response = self.llm(self.prompt)
        self.signals.finished.emit(response["choices"][0]["text"])


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
        self.setWindowTitle(self.tr("AI Assistant"))
        layout = QVBoxLayout(self)

        self.btn_analysis = QPushButton(self.tr("Analyze Column Headers"))
        self.btn_analysis.clicked.connect(self.analysis_table)
        layout.addWidget(self.btn_analysis)

        self.output_text = QTextEdit()
        self.output_text.setPlaceholderText(self.tr("Analysis results will be displayed here..."))
        self.output_text.setReadOnly(True)
        self.output_text.setMinimumHeight(300)
        self.output_text.setMinimumWidth(700)
        layout.addWidget(self.output_text)

    def set_data(self, data):
        """Set the data for analysis."""
        self.data = data

    def init_llm(self, model_path):
        """Initialize the LLM with the given model path."""
        self.llm = Llama(model_path=model_path)

    def analysis_table(self):
        """Analyze the table data using the LLM."""
        if self.llm is None or self.data is None:
            return

        self.worker = TableAnalysisWorker(self.llm, self.data)
        self.worker.signals.finished.connect(self.on_analysis_finished)
        self.worker.signals.messages.connect(self.loading_dialog.show_message)
        self.worker.signals.finished.connect(self.loading_dialog.close)
        self.worker.start()

        self.loading_dialog.show()

    def on_analysis_finished(self, result):
        """Handle the result of the table analysis."""
        self.output_text.setMarkdown(result)


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
        self.load_models()

    def init_ui(self):
        """Initialize the UI for the Llama download dialog."""
        self.setWindowTitle(self.tr("Download LLama Model"))
        self.setMinimumSize(500, 400)
        layout = QVBoxLayout(self)

        # Models List Section
        label_models = QLabel(self.tr("Available Models:"))
        layout.addWidget(label_models)

        self.model_list = QListWidget()
        self.model_list.setMinimumHeight(200)
        layout.addWidget(self.model_list)

        self.btn_select = QPushButton(self.tr("Select Model"))
        self.btn_select.clicked.connect(self.select_model)
        layout.addWidget(self.btn_select)

        # Download Section
        label_download = QLabel(self.tr("Download a new model:"))
        layout.addWidget(label_download)

        download_layout = QHBoxLayout()

        self.models_urls_combo = QComboBox()
        self.models_urls_combo.addItems(list(AI_MODELS.keys()))
        download_layout.addWidget(self.models_urls_combo)

        self.btn_download = QPushButton(self.tr("Download"))
        self.btn_download.clicked.connect(self.on_download_model)
        download_layout.addWidget(self.btn_download)

        layout.addLayout(download_layout)

    def select_model(self):
        """Select the model from the list and close the dialog."""
        selected_items = self.model_list.selectedItems()
        if not selected_items:
            return

        model_name = selected_items[0].text()
        model_path = os.path.join(AI_MODELS_PATH, model_name)
        if not os.path.exists(model_path):
            return

        self.selected_model_path = model_path
        self.accept()

    def load_models(self):
        """Load available models from the models directory"""
        self.model_list.clear()

        # Ensure the models directory exists
        if not os.path.exists(AI_MODELS_PATH):
            os.makedirs(AI_MODELS_PATH)

        for filename in os.listdir(AI_MODELS_PATH):
            if filename.startswith("."):
                continue
            self.model_list.addItem(filename)

    @Slot()
    def on_download_model(self):
        """Download the selected model."""
        model_name = self.models_urls_combo.currentText()
        model_url = AI_MODELS.get(model_name)
        self.download_file_path = AI_MODELS_PATH / f"{model_name}.gguf"

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
            self.load_models()

        self.btn_download.setDisabled(True)

        # Create the file in write mode to append bytes
        self.file = QSaveFile(str(self.download_file_path))

        if self.file.open(QIODevice.OpenModeFlag.WriteOnly):
            self.reply = self.manager.get(QNetworkRequest(model_url))

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
    def on_download_abort(self):
        """When user press abort button"""
        if self.reply:
            self.reply.abort()
        if self.file:
            self.file.cancelWriting()
            # cancelWriting should delete the file but it doesn't seems to be happening.
            if self.download_file_path.exists():
                self.download_file_path.unlink()
                self.load_models()

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
        self.load_models()

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
            self.progress_dialog.setMaximum(bytesTotal)
            self.progress_dialog.setValue(bytesReceived)
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


class TableAnalysisWorker(QThread):
    """Extended worker for table analysis with your signal system"""

    def __init__(self, llm, data):
        super().__init__()
        self.llm = llm
        self.data = data
        self.signals = DataWorkerSignals()

    def run(self):
        """Run the analysis on the table data using the LLM."""
        try:
            self.signals.messages.emit("Preparing data for analysis...")

            prompt = self.prepare_analysis_prompt()

            self.signals.messages.emit("Running analysis with LLM...")
            response = self.llm(prompt)
            result = response["choices"][0]["text"]

            self.signals.finished.emit(result)

        except Exception as e:
            self.signals.finished.emit(f"Analysis error: {str(e)}")

    def prepare_analysis_prompt(self):
        """Convert table data to prompt for analysis"""

        headers = self.data[0]
        prompt = f"""<|im_start|>system
        You are a data analyst expert.<|im_end|>
        <|im_start|>user
        Column headers: {" | ".join(headers)}

        Suggest better names for unclear or generic columns.<|im_end|>
        <|im_start|>assistant"""

        return prompt
