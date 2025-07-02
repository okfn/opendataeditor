from PySide6.QtWidgets import QDialog, QVBoxLayout, QTextEdit, QPushButton, QLabel, QListWidget, QHBoxLayout, QComboBox
from PySide6.QtCore import QThread, Signal
from llama_cpp import Llama as LlamaCPP

from ode.dialogs.loading import LoadingDialog
from ode.panels.data import QObject

import os
import urllib.request

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


class LlamaDownloadWorker(QThread):
    """Worker for downloading LLama models from a URL."""

    finished = Signal()

    def __init__(self, url, filepath):
        super().__init__()
        self.url = url
        self.filepath = filepath

    def run(self):
        """Download the model from the specified URL."""
        urllib.request.urlretrieve(self.url, self.filepath)
        self.finished.emit()


class LlamaDownloadDialog(QDialog):
    """Dialog for downloading and selecting LLama models."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.download_worker = None
        self.selected_model_path = None
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
        self.btn_download.clicked.connect(self.download_model)
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

    def download_model(self):
        """Download a model from the provided URL."""
        # Get the filename from the URL
        model_name = self.models_urls_combo.currentText()
        model_url = AI_MODELS.get(model_name)
        filepath = AI_MODELS_PATH / f"{model_name}.gguf"

        self.btn_download.setEnabled(False)
        self.btn_download.setText(self.tr("Downloading..."))

        # Init and start the download worker
        self.download_worker = LlamaDownloadWorker(model_url, filepath)
        self.download_worker.finished.connect(self.on_download_finished)
        self.download_worker.start()

    def on_download_finished(self):
        """Handle the completion of the download."""
        self.btn_download.setEnabled(True)
        self.btn_download.setText(self.tr("Download"))
        self.load_models()


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
        Column headers: {' | '.join(headers)}

        Suggest better names for unclear or generic columns.<|im_end|>
        <|im_start|>assistant"""

        return prompt
