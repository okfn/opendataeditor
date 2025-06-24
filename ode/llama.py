from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QTextEdit,
    QPushButton,
    QFileDialog,
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

    def __call__(self, prompt, max_tokens=512):
        response = self.model(prompt, max_tokens=max_tokens)
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
        response = self.llm(self.prompt, max_tokens=512)
        self.signals.finished.emit(response["choices"][0]["text"])


class LlamaDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.llm = None
        self.worker = None
        self.init_ui()

        self.loading_dialog = LoadingDialog(self)

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
