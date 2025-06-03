import collections

from PySide6.QtCore import Qt, QSortFilterProxyModel
from PySide6.QtWidgets import QWidget, QLabel, QHBoxLayout, QVBoxLayout, QTableView
from PySide6.QtGui import QFont

from ode import utils
from ode.panels.data import DEFAULT_LIMIT_ERRORS
from ode.shared import COLOR_RED


class ErrorFilterProxyModel(QSortFilterProxyModel):
    """Proxy model to display only the rows of the given error type.

    As recommended by Qt, ODE reuses the same FrictionlessTableModel for all the TableViews.
    For ErrorReports we filter and show only the rows containing the specific error_type
    we want to display.
    """

    def __init__(self, error_type):
        super().__init__()
        self.error_type = error_type

    def filterAcceptsRow(self, source_row, source_parent):
        """Accept rows that contains an error.

        The source_model is a FrictionlessTableModel and its errors attribute
        contains a list of tuples:
            [..., (row_number, error_type, error_message), ...]
        """
        source_model = self.sourceModel()
        if source_model.errors[source_row] is None or len(source_model.errors[source_row]) == 0:
            return False

        for error in source_model.errors[source_row]:
            if error[1] == self.error_type:
                return True

        return False

    def data(self, index, role):
        """Overrides the data method to set the background color of the cells according the error type."""
        if not index.isValid():
            return None

        # Converts the index to the source model so we can map it with the errors list
        source_index = self.mapToSource(index)
        source_row = source_index.row()
        source_column = source_index.column()

        if role == Qt.ItemDataRole.BackgroundRole:
            source_model = self.sourceModel()

            if source_model.errors[source_row] is None or len(source_model.errors[source_row]) == 0:
                # Default color
                return None

            for error in source_model.errors[source_row]:
                if self.error_type == "blank-row":
                    # BlankRowError does not have field_number, we paint all the cells.
                    return COLOR_RED
                elif error[0] == source_column and error[1] == self.error_type:
                    return COLOR_RED

            # Default color
            return None

        return super().data(index, role)


class ErrorTitle(QWidget):
    """Widget to display the error type and count."""

    def __init__(self, title, count):
        super().__init__()

        layout = QHBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)

        title = QLabel(title)
        font = QFont()
        font.setBold(True)
        title.setFont(font)

        errors = QLabel(str(count), objectName="errors")

        layout.addWidget(title)
        layout.addWidget(errors)
        layout.addStretch()

        self.setLayout(layout)

        self.setStyleSheet(
            """
            QLabel#errors {
              background: #D32F2F;
              color: #FFF;
              padding: 2px 2px;
              border-style: outset;
              border-width: 1px;
              border-radius: 4px;
              border-color: #D32F2F;
            }
        """
        )


class ErrorReport(QWidget):
    """Widget to show a single-type Error report.

    This widget will be use in the Errors view for every type of error that
    frictionless validate finds. It display the title, description and table
    preview for a specific type of error.

    The error argument is a list of Frictionless errors object of the same type
    of error.
    """

    def __init__(self, errors, model, *args, **kwargs):
        super().__init__(*args, **kwargs)

        utils.set_common_style(self)

        self.title = ErrorTitle(errors[0].title, len(errors))
        self.description = QLabel(errors[0].description)
        font = self.description.font()
        font.setPointSize(12)
        self.description.setFont(font)
        self.description.setWordWrap(True)

        self.proxy_model = ErrorFilterProxyModel(errors[0].type)
        self.proxy_model.setSourceModel(model)
        self.table = QTableView()
        self.table.setModel(self.proxy_model)

        vbox = QVBoxLayout()
        vbox.addWidget(self.title)
        vbox.addWidget(self.description)
        vbox.addWidget(self.table)
        self.setLayout(vbox)


class ErrorsWidget(QWidget):
    """Widget to dynamically show errors reports."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.layout = QVBoxLayout()

        self.max_errors_label = QLabel()
        font = QFont()
        font.setItalic(True)
        self.max_errors_label.setFont(font)
        self.max_errors_label.setStyleSheet("font-size: 17px")
        self.max_errors_label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop)

        self.reports = QWidget()
        self.reports_layout = QVBoxLayout()
        self.reports_layout.setContentsMargins(0, 0, 0, 0)
        self.reports.setLayout(self.reports_layout)

        self.layout.addWidget(self.max_errors_label)
        self.layout.addWidget(self.reports)

        self.setLayout(self.layout)

    def display_errors(self, errors, model):
        """Builds and display the entire error report.

        This method should be called when reading and validating a
        tabular file. It is currently triggered when the user clicks on
        a file in the FileTreeNavigator
        """
        self.clear()
        if not errors:
            return

        errors_list = self._sort_frictionless_errors(errors)
        total_errors = 0
        for error in errors_list:
            errorReport = ErrorReport(error, model)
            self.reports_layout.addWidget(errorReport)
            total_errors += len(error)
        self.reports.show()

        if total_errors >= DEFAULT_LIMIT_ERRORS:
            self.max_errors_label.show()
        else:
            self.max_errors_label.hide()

    def clear(self):
        """Removes all the ErrorReports that have been added to this widget."""
        while self.reports_layout.count():
            errorReport = self.reports_layout.takeAt(0)
            errorReport.widget().deleteLater()
        self.reports.hide()

    def _sort_frictionless_errors(self, errors):
        """Splits a list of dictionaries into several lists grouped by type.

        Frictionless returns an array of Error objects, since we want to create an
        ErrorReport for each type of error, we rearrange the array into a list of
        arrays in which each one contains only one error type.
        """
        result = collections.defaultdict(list)
        for error in errors:
            result[error.type].append(error)
        return list(result.values())

    def retranslateUI(self):
        self.max_errors_label.setText(
            self.tr("Please note that the ODE currently detects errors in tables, with a maximum of ")
            + str(DEFAULT_LIMIT_ERRORS)
        )
