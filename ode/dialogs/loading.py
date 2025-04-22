from PySide6.QtWidgets import QDialog, QProgressBar, QVBoxLayout, QLabel
from PySide6.QtCore import QTimer


class LoadingDialog(QDialog):
    """
    Dialog to show a loading message while the application is doing some work.
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMinimumSize(350, 80)

        self.label = QLabel()
        self.label.setMargin(0)
        self.progressBar = QProgressBar()
        self.progressBar.setRange(0, 0)

        mainLayout = QVBoxLayout(self)
        mainLayout.addWidget(self.label)
        mainLayout.addWidget(self.progressBar)

        self.timer = QTimer()
        self.timer.setSingleShot(True)
        self.timer.timeout.connect(self.exec)

        self.retranslateUI()

    def retranslateUI(self):
        self.setWindowTitle(self.tr("Loading"))
        self.label.setText(self.tr("Loading..."))

    def cancel_loading_timer(self):
        if self.timer.isActive():
            self.timer.stop()

    def show(self):
        self.timer.start(300)
