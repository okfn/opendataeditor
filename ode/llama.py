from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QTextEdit,
    QPushButton,
    QLabel,
    QListWidget,
    QHBoxLayout,
    QLineEdit,
)
from PySide6.QtCore import QThread, Signal
import ollama

from ode.dialogs.loading import LoadingDialog
from ode.panels.data import QObject


class OllamaClient:
    def __init__(self, model_name):
        self.model_name = model_name

    def __call__(self, prompt):
        response = ollama.chat(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
        )

        return response


class DataWorkerSignals(QObject):
    """Define the signals for the DataWorker."""

    finished = Signal(tuple)
    messages = Signal(str)


class OllamaWorker(QThread):
    def __init__(self, llm, prompt):
        super().__init__()
        self.llm = llm
        self.prompt = prompt
        self.signals = DataWorkerSignals()

    def run(self):
        # self.signals.messages.emit(self.tr("Running LLM with prompt..."))
        self.signals.messages.emit("Running LLM with prompt...")
        response = self.llm(self.prompt)
        self.signals.finished.emit(response["message"]["content"])


class OllamaDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.llm = None
        self.worker = None
        self.init_ui()

        self.loading_dialog = LoadingDialog(self)
        self.data = None

    def init_ui(self):
        self.setWindowTitle(self.tr("AI Chat"))
        layout = QVBoxLayout(self)

        self.input_text = QTextEdit()
        self.input_text.setMinimumHeight(100)
        self.input_text.setMinimumWidth(700)
        layout.addWidget(self.input_text)

        self.btn_send = QPushButton(self.tr("Send"))
        self.btn_send.clicked.connect(self.send_message)
        layout.addWidget(self.btn_send)

        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setMinimumHeight(300)
        self.output_text.setMinimumWidth(700)
        layout.addWidget(self.output_text)

        self.btn_analysis = QPushButton(self.tr("Test Analysis"))
        self.btn_analysis.clicked.connect(self.analysis_table)
        layout.addWidget(self.btn_analysis)

    def set_data(self, data):
        """Set the data for analysis."""
        self.data = data

    def init_llm(self, model_name):
        self.llm = OllamaClient(model_name)

    def send_message(self):
        self.btn_send.setEnabled(False)
        self.worker = OllamaWorker(self.llm, self.input_text.toPlainText())
        self.worker.signals.finished.connect(self.on_response)
        self.worker.signals.messages.connect(self.loading_dialog.show_message)
        self.worker.signals.finished.connect(self.loading_dialog.close)
        self.worker.start()

        self.loading_dialog.show()

    def on_response(self, text):
        self.output_text.setText(text)
        self.btn_send.setEnabled(True)

    def analysis_table(self):
        if self.llm is None or self.data is None:
            return

        self.worker = TableAnalysisWorker(self.llm, self.data)
        self.worker.signals.finished.connect(self.on_analysis_finished)
        self.worker.signals.messages.connect(self.loading_dialog.show_message)
        self.worker.signals.finished.connect(self.loading_dialog.close)
        self.worker.start()

        self.loading_dialog.show()

    def on_analysis_finished(self, result):
        self.output_text.append(result)


class OllamaModelDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.selected_model = None
        self.init_ui()
        self.load_models()

    def init_ui(self):
        self.setWindowTitle(self.tr("OLlama Model Manager"))
        self.setMinimumSize(500, 400)
        layout = QVBoxLayout(self)

        # Show installed models
        label_models = QLabel(self.tr("Installed models:"))
        layout.addWidget(label_models)

        self.model_list = QListWidget()
        self.model_list.setMinimumHeight(200)
        layout.addWidget(self.model_list)

        # Section for downloading new models
        label_download = QLabel(self.tr("Download new model:"))
        layout.addWidget(label_download)

        download_layout = QHBoxLayout()
        self.model_input = QLineEdit()
        self.model_input.setPlaceholderText("qwen3, mistral, llama2, etc.")
        download_layout.addWidget(self.model_input)

        self.btn_download = QPushButton(self.tr("Download"))
        self.btn_download.clicked.connect(self.download_model)
        download_layout.addWidget(self.btn_download)

        layout.addLayout(download_layout)

        self.btn_select = QPushButton(self.tr("Select Model"))
        self.btn_select.clicked.connect(self.select_model)
        layout.addWidget(self.btn_select)

    def load_models(self):
        self.model_list.clear()
        models = ollama.list()
        for model in models["models"]:
            self.model_list.addItem(model.model)

    def select_model(self):
        selected_items = self.model_list.selectedItems()
        if not selected_items:
            return

        self.selected_model = selected_items[0].text()
        self.accept()

    def download_model(self):
        """Descarga un modelo desde una URL"""
        model_name = self.model_input.text().strip()
        if not model_name:
            return

        self.btn_download.setEnabled(False)
        self.btn_download.setText(self.tr("Downloading..."))

        self.download_worker = OllamaDownloadWorker(model_name)
        self.download_worker.finished.connect(self.on_download_finished)
        self.download_worker.start()

    def on_download_finished(self):
        self.btn_download.setEnabled(True)
        self.btn_download.setText(self.tr("Download"))
        self.model_input.clear()
        self.load_models()  # Actualizar la lista


class OllamaDownloadWorker(QThread):
    """Worker to download a model in the background."""

    finished = Signal()

    def __init__(self, model_name):
        super().__init__()
        self.model_name = model_name

    def run(self):
        try:
            ollama.pull(self.model_name)
        except Exception as e:
            print(f"Error downloading model {self.model_name}: {str(e)}")
        finally:
            self.finished.emit()


class TableAnalysisWorker(QThread):
    """Extended worker for table analysis with your signal system"""

    def __init__(self, llm, data):
        super().__init__()
        self.llm = llm
        self.data = data
        self.signals = DataWorkerSignals()

    def run(self):
        try:
            self.signals.messages.emit("Preparing data for analysis...")

            prompt = self.prepare_analysis_prompt()

            self.signals.messages.emit("Running analysis with LLM...")
            response = self.llm(prompt)
            result = response["message"]["content"]

            self.signals.finished.emit(result)

        except Exception as e:
            self.signals.finished.emit(f"Analysis error: {str(e)}")

    def prepare_analysis_prompt(self):
        """Convert table data to prompt for analysis"""
        headers = self.data[0]
        prompt = f"""
Act as an expert data analyst. Analyze these data headers:
{'|'.join(headers)}

REQUIRED ANALYSIS:
    Column Suggestions: If any column names are unclear, missing, or generic (e.g., Column1, X1), suggest more meaningful names based on the data content.
"""
        print(prompt)
        return prompt
