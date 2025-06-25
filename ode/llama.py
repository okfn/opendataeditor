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
from llama_cpp import Llama as LlamaCPP

from ode.dialogs.loading import LoadingDialog
from ode.panels.data import QObject

import os
import urllib.request


class Llama:
    def __init__(self, model_path):
        self.model = LlamaCPP(model_path=model_path)

    def __call__(self, prompt):
        response = self.model(prompt)
        return response


class DataWorkerSignals(QObject):
    """Define the signals for the DataWorker."""

    finished = Signal(tuple)
    messages = Signal(str)


class LlamaWorker(QThread):
    def __init__(self, llm, prompt):
        super().__init__()
        self.llm = llm
        self.prompt = prompt
        self.signals = DataWorkerSignals()

    def run(self):
        self.signals.messages.emit("Procesando solicitud...")
        response = self.llm(self.prompt)
        self.signals.finished.emit(response["choices"][0]["text"])


class LlamaDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.llm = None
        self.worker = None
        self.init_ui()

        self.loading_dialog = LoadingDialog(self)
        self.data = None

    def init_ui(self):
        self.setWindowTitle("LLaMA Chat")
        layout = QVBoxLayout(self)

        self.input_text = QTextEdit()
        self.input_text.setMinimumHeight(100)
        self.input_text.setMinimumWidth(700)
        layout.addWidget(self.input_text)

        self.btn_send = QPushButton("Enviar")
        self.btn_send.clicked.connect(self.send_message)
        layout.addWidget(self.btn_send)

        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setMinimumHeight(300)
        self.output_text.setMinimumWidth(700)
        layout.addWidget(self.output_text)

        self.btn_analysis = QPushButton("Analisis")
        self.btn_analysis.clicked.connect(self.analysis_table)
        layout.addWidget(self.btn_analysis)

    def set_data(self, data):
        """Set the data for analysis."""
        self.data = data

    # def init_llm(self):
    #     if not self.llm:
    #         model_path, _ = QFileDialog.getOpenFileName(self, "Seleccionar modelo")
    #         if not model_path:
    #             return False
    #         self.llm = Llama(model_path=model_path)

    #     return True

    def init_llm(self, model_path):
        self.llm = Llama(model_path=model_path)

    def send_message(self):
        self.worker = LlamaWorker(self.llm, self.input_text.toPlainText())
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


class LlamaDownloadWorker(QThread):
    finished = Signal()

    def __init__(self, url, filepath):
        super().__init__()
        self.url = url
        self.filepath = filepath

    def run(self):
        urllib.request.urlretrieve(self.url, self.filepath)
        self.finished.emit()


class LlamaDownloadDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.models_dir = "./models"
        self.download_worker = None
        self.selected_model_path = None
        self.init_ui()
        self.load_models()

    def init_ui(self):
        self.setWindowTitle("Gestor de Modelos")
        self.setMinimumSize(500, 400)
        layout = QVBoxLayout(self)

        # Lista de modelos
        label_models = QLabel("Modelos disponibles:")
        layout.addWidget(label_models)

        self.model_list = QListWidget()
        self.model_list.setMinimumHeight(200)
        layout.addWidget(self.model_list)

        # Sección de descarga
        label_download = QLabel("Descargar nuevo modelo:")
        layout.addWidget(label_download)

        download_layout = QHBoxLayout()

        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("https://ejemplo.com/modelo.gguf")
        download_layout.addWidget(self.url_input)

        self.btn_download = QPushButton("Descargar")
        self.btn_download.clicked.connect(self.download_model)
        download_layout.addWidget(self.btn_download)

        layout.addLayout(download_layout)

        self.btn_select = QPushButton("Seleccionar")
        self.btn_select.clicked.connect(self.select_model)
        layout.addWidget(self.btn_select)

    def select_model(self):
        selected_items = self.model_list.selectedItems()
        if not selected_items:
            return

        model_name = selected_items[0].text()
        model_path = os.path.join(self.models_dir, model_name)
        if not os.path.exists(model_path):
            return

        self.selected_model_path = model_path
        self.accept()

    def load_models(self):
        """Carga la lista de modelos desde el directorio"""
        self.model_list.clear()

        # Crear directorio si no existe
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)

        # Buscar archivos de modelo
        # model_extensions = [".gguf", ".ggml", ".bin"]

        for filename in os.listdir(self.models_dir):
            # if any(filename.lower().endswith(ext) for ext in model_extensions):
            # self.model_list.addItem(filename)
            self.model_list.addItem(filename)

    def download_model(self):
        """Descarga un modelo desde una URL"""
        url = self.url_input.text().strip()
        if not url:
            return

        # Extraer nombre del archivo de la URL
        filename = url.split("/")[-1]
        if not filename:
            filename = "modelo.gguf"

        filepath = os.path.join(self.models_dir, filename)

        self.btn_download.setEnabled(False)
        self.btn_download.setText("Descargando...")

        # Crear worker para descarga
        self.download_worker = LlamaDownloadWorker(url, filepath)
        self.download_worker.finished.connect(self.on_download_finished)
        self.download_worker.start()

    def on_download_finished(self):
        """Se ejecuta cuando termina la descarga"""
        self.btn_download.setEnabled(True)
        self.btn_download.setText("Descargar")
        self.url_input.clear()
        self.load_models()  # Actualizar la lista


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
            result = response["choices"][0]["text"]

            self.signals.finished.emit(result)

        except Exception as e:
            self.signals.finished.emit(f"Analysis error: {str(e)}")

    def prepare_analysis_prompt(self):
        """Convert table data to prompt for analysis"""
        headers = self.data[0]
        rows = self.data[1:]
        table_text = self.format_table_for_prompt(headers, rows)

        prompt = f"""
Act as an expert data analyst. Analyze this data table:

DATA TABLE:
{table_text}

REQUIRED ANALYSIS:
1. **Statistical Summary**: For numeric columns, calculate basic descriptive statistics
2. **Data Quality**: Identify potential issues (missing values, inconsistencies, potential outliers)
3. **Distributions**: Describe value distributions in each column
4. **Relationships**: Identify possible correlations between variables
5. **Key Insights**: Provide 3-5 important findings
6. **Recommendations**: Suggest additional analysis or data cleaning steps

Be specific and data-driven in your analysis.
"""
        print(prompt)
        return prompt

    def format_table_for_prompt(self, headers, rows):
        """Convert table data to readable text format"""
        table_lines = []

        # Headers
        table_lines.append(" | ".join(str(h) for h in headers))

        # Data rows
        for row in rows:
            row_line = " | ".join(str(cell) if cell is not None else "NULL" for cell in row)
            table_lines.append(row_line)

        return "\n".join(table_lines)
