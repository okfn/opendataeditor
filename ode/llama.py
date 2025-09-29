import sys
import os
import logging
from pathlib import Path
from typing import NamedTuple
from enum import Enum

from llama_cpp import Llama
from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QTextEdit,
    QPushButton,
    QLabel,
    QHBoxLayout,
    QMessageBox,
    QProgressDialog,
    QComboBox,
    QWidget,
)
from PySide6.QtCore import QThread, Signal, QObject, QSaveFile, QIODevice, Slot, Qt
from PySide6.QtNetwork import QNetworkReply, QNetworkRequest, QNetworkAccessManager

from ode.paths import AI_MODELS_PATH

if not os.path.exists(AI_MODELS_PATH):
    os.makedirs(AI_MODELS_PATH)

logger = logging.getLogger(__name__)


class PromptKeys(Enum):
    SELECT = "select"
    COLUMNS = "columns"
    ANALYSIS = "analysis"


class AIModel(NamedTuple):
    """Data structure to hold AI model information."""

    name: str
    url: str
    filename: str


AI_MODEL = AIModel(
    name="Llama 3.2 3B (2.0GB)",
    url="https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf?download=true",
    filename="Llama-3.2-3B-Instruct-Q4_K_M.gguf",
)


class LlamaWorkerSignals(QObject):
    """Define the signals for the LlamaWorker."""

    finished = Signal()
    error = Signal(str)
    stream_token = Signal(str)
    started = Signal()


class LlamaWorker(QThread):
    """
    LlamaWorker is a QThread that processes a prompt using the LLM with streaming.
    """

    def __init__(self, llm, prompt):
        super().__init__()
        self.llm = llm
        self.prompt = prompt
        self.signals = LlamaWorkerSignals()

    def run(self):
        try:
            self.signals.started.emit()
            messages = [
                {
                    "role": "system",
                    "content": "You are an English-speaking Data Analyst in charge of reviewing and improving the quality of tabular files. You are concise and only reply with the answer, nothing else. You always respond in English, regardless of the input language.",
                },
                {
                    "role": "user",
                    "content": self.prompt,
                },
            ]
            for output in self.llm.create_chat_completion(messages, max_tokens=-1, stream=True, temperature=0.2):
                token = output["choices"][0]["delta"].get("content", "")
                self.signals.stream_token.emit(token)
            self.signals.finished.emit()
        except Exception as e:
            logger.error("Error during LLM processing", exc_info=True)
            self.signals.error.emit(str(e))


class LlamaDialog(QDialog):
    """
    Dialog for interacting with the LLM.
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.llm = None
        self.worker = None
        self.init_ui()
        self.data = None
        self.prompt = None

    def closeEvent(self, event):
        """Handle the close event to clear the output text."""
        if self.worker and self.worker.isRunning():
            self.worker.terminate()
            self.worker.wait()
        self.prompt_selector.setCurrentIndex(0)
        self.output_text.clear()
        self.on_execution_finished()
        event.accept()
        super().closeEvent(event)

    def init_ui(self):
        """Initialize the UI for the Llama dialog."""
        layout = QVBoxLayout(self)

        self.prompt_label = QLabel(
            "The AI assistant currently support two use cases. Please, select one of the following options:"
        )
        layout.addWidget(self.prompt_label)

        self.prompt_selector = QComboBox()
        options = [
            ("Please select a use case", PromptKeys.SELECT.value),
            ("Generate descriptions for columns", PromptKeys.COLUMNS.value),
            ("Suggest questions for data analysis", PromptKeys.ANALYSIS.value),
        ]
        for i, (text, key) in enumerate(options):
            self.prompt_selector.addItem(text)
            self.prompt_selector.setItemData(i, key)

        layout.addWidget(self.prompt_selector)

        self.btn_is_running = False
        self.btn_run = QPushButton()
        self.btn_run.setEnabled(False)
        self.btn_run.clicked.connect(self.run)
        layout.addWidget(self.btn_run)

        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setMinimumHeight(300)
        self.output_text.setMinimumWidth(700)
        layout.addWidget(self.output_text)

        self.prompt_text_label = QLabel(
            "This answer is AI generated. We recommend users to check responses to make sure they are in accordance with the table's data"
        )
        layout.addWidget(self.prompt_text_label)

        self.prompt_selector.activated.connect(self.set_prompt)

        self.retranslateUI()

    def set_data(self, data):
        """Set the data for analysis."""
        self.data = data

    def _get_columns_prompt(self):
        headers = [str(h) for h in self.data[0] if h is not None and h != ""]
        prompt = f"""# Explain the column names
Below is the metadata and sample data of a dataset that you will suggest columns descriptions.

## Describe what each columns means in the context of the dataset
 1. Please provide a description for each column name.
 2. Assume the user does not know anything about the topic.
 3. Use plain language and be verbose when explaining what data the column contains.
 4. If there are technical terms, expand the description to explain what that term means in the context of the dataset.
 5. Use the content of the First 5 rows to gain context about the columns so you answer is more accurate.

# Metadata
Current column names: {" | ".join(headers)}
First 5 rows: {self.data[1:6]}
"""

        return prompt

    def _get_analysis_prompt(self):
        headers = [str(h) for h in self.data[0] if h is not None and h != ""]
        prompt = f"""# Understand the Data:
Below is the metadata and sample data of a dataset that you will suggest analysis for.

## Create questions that cover a wide range of analytical techniques:
  1. Descriptive Statistics: (e.g., counts, averages, distributions, min/max)
  2. Trend Analysis: (e.g., over time, across categories)
  3. Relationship & Correlation: (e.g., between two numeric columns)
  4. Segmentation & Comparison: (e.g., comparing groups based on a category)
  5. Aggregation & Binning: (e.g., using groups and summary functions)
  6. Data Quality & Anomalies: (e.g., missing values, outliers)

## Tailor the Questions:
The questions must be specific to the provided column names and inferred context. Do not generate generic questions that could apply to any dataset.

## Value of the Question:
For each question you would add a sentence providing what useful information could be get out of the answer and why you consider the question important.

# Metadata:
 1. Column names: {" | ".join(headers)}
 2. First 5 rows: {self.data[1:6]}
"""
        return prompt

    def set_prompt(self, index):
        """Set the prompt"""
        key = self.prompt_selector.itemData(index)
        self.prompt = "No prompt selected."
        self.output_text.clear()
        if key == PromptKeys.SELECT.value:
            self.prompt = None
            self.btn_run.setEnabled(False)
            return

        if key == PromptKeys.COLUMNS.value:
            self.prompt = self._get_columns_prompt()
        elif key == PromptKeys.ANALYSIS.value:
            self.prompt = self._get_analysis_prompt()

        if not self.btn_is_running:
            self.btn_run.setEnabled(True)

    def init_llm(self, model_path):
        """Initialize the LLM with the given model path."""
        cores = self._calculate_half_cpu_count()
        self.llm = Llama(
            model_path=model_path,
            n_ctx=4096,
            # chat_format="llama-3",  # TODO: Understand if this is being inferred correctly from the model metadata.
            verbose=False,  # Change to True for verbose output when running the model in development.
            seed=4294967295,  # Copied from llama.cpp server.
            n_threads=cores,
            n_threads_batch=cores,
        )

    def run(self):
        if self.llm is None or self.data is None:
            return

        self.output_text.clear()

        self.btn_run.setEnabled(False)

        self.worker = LlamaWorker(self.llm, self.prompt)
        self.worker.signals.started.connect(self.on_execution_started)
        self.worker.signals.finished.connect(self.on_execution_finished)
        self.worker.signals.error.connect(self.on_execution_error)
        self.worker.signals.stream_token.connect(self.on_stream_token)
        self.worker.start()

    def on_execution_started(self):
        """Handle the start of execution."""
        self.btn_run.setText(self.tr("Generating response..."))
        self.btn_is_running = True

    def on_execution_finished(self):
        """Handle the completion of execution."""
        self.btn_run.setText(self.tr("Execute"))
        self.btn_is_running = False
        self.btn_run.setEnabled(True)

    def on_execution_error(self, error_msg):
        """Handle execution errors."""
        self.btn_run.setEnabled(True)
        self.btn_run.setText(self.tr("Execute"))
        QMessageBox.critical(self, self.tr("Error"), error_msg)

    def on_stream_token(self, token):
        """Inserts token and scrolls down to ensure stream is allways visible."""
        self.output_text.insertPlainText(token)
        self.output_text.ensureCursorVisible()

    def retranslateUI(self):
        """Retranslate the UI elements."""
        self.setWindowTitle(self.tr("AI assistant"))
        self.btn_run.setText(self.tr("Execute"))
        self.output_text.setPlaceholderText(self.tr("Results will be displayed here..."))

    def _calculate_half_cpu_count(self) -> int:
        """Returns half of the core number of the current machine.

        By default LLMs use all of the available cores in the machine causing the computer
        to freeze as it is using all the resources availables. We are limiting to half.
        """
        cores = os.cpu_count()
        if cores and isinstance(cores, int):
            return int(cores / 2)
        return 4


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
        self.setWindowTitle(self.tr("AI assistant"))

        layout = QVBoxLayout(self)

        label_models = QLabel(self.tr("To start using the AI assistant, please download the following model."))
        layout.addWidget(label_models)

        label_download_location = QLabel(
            self.tr(
                f'The ODE will save the file in this location: <i><a href="file://{AI_MODELS_PATH}">{AI_MODELS_PATH}</a></i>'
            )
        )
        label_download_location.setTextFormat(Qt.TextFormat.RichText)
        label_download_location.setTextInteractionFlags(Qt.TextInteractionFlag.TextBrowserInteraction)
        label_download_location.linkActivated.connect(self.open_download_directory)

        layout.addWidget(label_download_location)

        # Single model row
        self.create_model_row(layout)

        # Next button section
        next_layout = QHBoxLayout()
        next_layout.addStretch()  # Push button to the right

        self.btn_next = QPushButton(self.tr("Next"))
        self.btn_next.clicked.connect(self.on_next)
        self.btn_next.setDefault(True)
        next_layout.addWidget(self.btn_next)

        layout.addLayout(next_layout)

        # Update button states on startup
        self.update_ui_state()

    def create_model_row(self, parent_layout):
        """Create the single model row with buttons."""
        # Model row widget
        model_row = QWidget()
        model_row.setObjectName("llamaDownloadModelRow")
        model_layout = QHBoxLayout(model_row)
        model_layout.setContentsMargins(10, 8, 10, 8)

        # Model name label
        self.model_label = QLabel()
        model_layout.addWidget(self.model_label)

        model_layout.addStretch()  # Push buttons to the right

        # Delete button
        self.btn_delete = QPushButton(self.tr("Delete"))
        self.btn_delete.setObjectName("deleteButton")
        self.btn_delete.clicked.connect(self.on_delete_model)
        model_layout.addWidget(self.btn_delete)

        # Download button
        self.btn_download = QPushButton(self.tr("Download"))
        self.btn_download.setObjectName("downloadButton")  # Class name for QSS
        self.btn_download.clicked.connect(self.on_download_model)
        model_layout.addWidget(self.btn_download)

        model_layout.setSpacing(10)

        parent_layout.addWidget(model_row)

    def update_ui_state(self):
        """Update UI elements based on download status."""
        is_downloaded = self.is_model_downloaded()

        # Update label text and style
        status_text = "Downloaded" if is_downloaded else "Not downloaded"
        self.model_label.setText(f"{AI_MODEL.name} ({status_text})")

        # Update button states and styles
        self.btn_delete.setEnabled(is_downloaded)
        self.btn_download.setEnabled(not is_downloaded)
        self.btn_next.setEnabled(is_downloaded)

    def is_model_downloaded(self):
        """Check if the model is already downloaded."""
        model_path = AI_MODELS_PATH / AI_MODEL.filename
        return model_path.exists()

    def on_next(self):
        """Continue to next step - use the downloaded model."""
        model_path = AI_MODELS_PATH / AI_MODEL.filename
        self.selected_model_path = str(model_path)
        self.accept()

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
        """Download the model."""
        self.download_file_path = AI_MODELS_PATH / AI_MODEL.filename

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

        # Disable download button during download
        self.btn_download.setEnabled(False)

        # Create the file in write mode to append bytes
        self.file = QSaveFile(str(self.download_file_path))

        if self.file.open(QIODevice.OpenModeFlag.WriteOnly):
            self.reply = self.manager.get(QNetworkRequest(AI_MODEL.url))

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
        """Delete the model file."""
        # Confirm deletion
        ret = QMessageBox.question(
            self,
            self.tr("Confirm Deletion"),
            self.tr(f"Are you sure you want to delete {AI_MODEL.name}?"),
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )

        if ret == QMessageBox.StandardButton.No:
            return

        model_path = AI_MODELS_PATH / AI_MODEL.filename
        model_path.unlink(missing_ok=True)
        self.update_ui_state()

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

        self.btn_download.setEnabled(True)

    @Slot()
    def on_download_finished(self):
        """Handle the completion of the download."""
        if self.reply:
            self.reply.deleteLater()

        if self.file:
            self.file.commit()

        self.update_ui_state()  # Refresh UI state

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
