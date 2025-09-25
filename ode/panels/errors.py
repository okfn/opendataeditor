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
        self.errors = errors
        utils.set_common_style(self)

        # Title of each error report: Label + count
        title = QWidget()
        title_layout = QHBoxLayout()
        title_layout.setContentsMargins(0, 0, 0, 0)

        self.title_label = QLabel(objectName="title_label")
        self.count_label = QLabel(objectName="count_label")

        title_layout.addWidget(self.title_label)
        title_layout.addWidget(self.count_label)
        title_layout.addStretch()

        title.setLayout(title_layout)

        # Description of the error
        self.description = QLabel()
        font = self.description.font()
        font.setPointSize(12)
        self.description.setFont(font)
        self.description.setWordWrap(True)

        # Previsualization table
        self.proxy_model = ErrorFilterProxyModel(self.errors[0].type)
        self.proxy_model.setSourceModel(model)
        self.table = QTableView()
        self.table.setModel(self.proxy_model)

        vbox = QVBoxLayout()
        vbox.addWidget(title)
        vbox.addWidget(self.description)
        vbox.addWidget(self.table)
        self.setLayout(vbox)

        self.setStyleSheet(
            """
            QLabel#title_label {
              font-weight: bold;
            }
            QLabel#count_label {
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

        self.retranslateUI()

    def retranslateUI(self):
        error_title = utils.ErrorTexts.get_error_title(self.errors[0].type) or self.errors[0].title
        error_count = str(len(self.errors))
        errors_description = utils.ErrorTexts.get_error_description(self.errors[0].type) or self.errors[0].description

        self.title_label.setText(error_title)
        self.count_label.setText(error_count)
        self.description.setText(errors_description)



class ErrorsWidget(QWidget):
    """Widget to dynamically show errors reports."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QVBoxLayout()

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

        layout.addWidget(self.max_errors_label)
        layout.addWidget(self.reports)

        self.setLayout(layout)

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
        for i in range(self.reports_layout.count()):
            self.reports_layout.itemAt(i).widget().retranslateUI()
