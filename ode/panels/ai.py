from PySide6.QtCore import Qt
from PySide6.QtWidgets import QDialog, QVBoxLayout, QLabel, QLineEdit, QPushButton, QTextEdit, QMessageBox
from openai import OpenAI


class ChatGPTDialog(QDialog):
    def __init__(self, parent):
        super().__init__(parent)
        self.setFixedWidth(800)
        self.setFixedHeight(800)
        layout = QVBoxLayout(self)

        # Decorative Note
        self.note_label = QLabel()
        self.note_label.setStyleSheet("font-style: italic; background-color: lightblue;")
        self.note_label.setWordWrap(True)
        self.api_key_label = QLabel()
        self.api_key_label.setStyleSheet("font-weight: 600;")
        self.api_key_input = QLineEdit()
        self.api_key_help_text = QLabel()
        self.api_key_help_text.setStyleSheet("font-style: italic; font-size: 16px;")
        self.api_key_help_text.setAlignment(Qt.AlignmentFlag.AlignRight)
        self.api_key_help_text.setTextFormat(Qt.RichText)
        self.api_key_help_text.setOpenExternalLinks(True)
        self.api_key_help_text.setWordWrap(True)
        self.api_key_input.setEchoMode(QLineEdit.Password)  # Masked for security

        self.prompt_label = QLabel()
        self.prompt_label.setStyleSheet("font-weight: 600;")
        self.prompt_input = QTextEdit()
        self.prompt_input.setText(
            ("suggest improvements to the names of the columns in the table and provide descriptions for each of them")
        )
        self.prompt_input.setStyleSheet("font-family: monospace;")
        self.prompt_input.setFixedHeight(100)
        self.result_label = QLabel()
        self.result_label.setStyleSheet("font-weight: 600;")
        self.result_display = QTextEdit()
        self.result_display.setReadOnly(True)

        self.submit_button = QPushButton()
        self.submit_button.clicked.connect(self.call_chatgpt_api)

        layout.addWidget(self.note_label)
        layout.addWidget(self.api_key_label)
        layout.addWidget(self.api_key_input)
        layout.addWidget(self.api_key_help_text)
        layout.addWidget(self.prompt_label)
        layout.addWidget(self.prompt_input)
        layout.addWidget(self.submit_button)
        layout.addWidget(self.result_label)
        layout.addWidget(self.result_display)

        self.retranslateUI()

    def call_chatgpt_api(self):
        if not hasattr(self.parent().metadata_widget, "resource"):
            # TODO: Define proper Classes APIs and attribute initialization (for resource)
            QMessageBox.warning(
                self, self.tr("Input Error"), self.tr("A data file must be selected in order to use the AI tool.")
            )
        api_key = self.api_key_input.text()
        prompt = self.prompt_input.toPlainText()
        fields = self.parent().metadata_widget.resource.schema.fields
        if not api_key or not prompt:
            QMessageBox.warning(self, self.tr("Input Error"), self.tr("API Key and Prompt are required!"))
            return

        prompt += f"\nThe following array contains the name and the type of the columns: {fields}"
        client = OpenAI(api_key=api_key)
        messages = [{"role": "system", "content": prompt}]
        try:
            response = client.chat.completions.create(messages=messages, model="gpt-4o")
            text = ""
            for choice in response.choices:
                text += choice.message.content

            self.result_display.setMarkdown(text)
        except Exception as e:
            QMessageBox.critical(self, self.tr("API Error"), self.tr(f"Error: {str(e)}"))

    def retranslateUI(self):
        self.setWindowTitle(self.tr("AI Assistant"))
        self.api_key_label.setText(self.tr("Please enter your OpenAI API Key: "))
        self.api_key_help_text.setText(
            self.tr(
                "Click <a href='https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key'>here</a> to learn how to find your key.<br>You can also check OpenAI terms and policies <a href='https://openai.com/policies/'>here</a>."
            )
        )
        self.prompt_label.setText(self.tr("Please enter your prompt to the AI assistant: "))
        self.result_label.setText(self.tr("Result: "))
        self.submit_button.setText(self.tr("Submit"))
        self.note_label.setText(
            self.tr(
                "<b>Data Privacy:</b> Open Data Editor will only share the names of the columns in your table to suggest improvements to the titles and descriptions associated with them."
            )
        )
