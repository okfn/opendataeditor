import json
import csv
import logging
from pathlib import Path
from frictionless import system

from PySide6.QtCore import Qt, QAbstractTableModel, QObject, Signal, Slot, QRunnable, QRect, QEvent
from PySide6.QtGui import QColor, QIcon, QCursor
from PySide6.QtWidgets import QWidget, QVBoxLayout, QTableView, QLabel, QApplication, QStyledItemDelegate

from openpyxl import Workbook

from ode import utils
from ode.dialogs.metadata import ColumnMetadataDialog
from ode.file import File
from ode.shared import COLOR_RED
from ode.paths import Paths

DEFAULT_LIMIT_ERRORS = 1000

logger = logging.getLogger(__name__)


class DataWorkerSignals(QObject):
    """Define the signals for the DataWorker."""

    finished = Signal(tuple)
    messages = Signal(str)


class DataWorker(QRunnable):
    """Worker to execute all the reading and validation tasks.

    This worker will allow us to read and validate the data (that can take several
    seconds) in the background. By moving this logic to a Worker we can avoid the
    application to get freeze while reading and instead display proper messages to
    the user.
    """

    def __init__(self, filepath):
        super().__init__()
        self.file = File(filepath)
        self.signals = DataWorkerSignals()
        self.resource = self.file.get_or_create_metadata().get("resource")

    @Slot()
    def run(self):
        """Reads and validates the data.

        We are using Resource.read_cells() because we want to read the data
        as is in the file in order to properly show data errors.

        We are using the system context to allow us to read from non-relative paths.

        This method emits a finished signal with all the data that the main UI requires to
        display the table and the errors.
        """
        with system.use_context(trusted=True):
            self.signals.messages.emit(QApplication.translate("DataWorker", "Reading file..."))
            data = self.resource.read_cells()
            self.signals.messages.emit(QApplication.translate("DataWorker", "Validating file..."))
            report = self.resource.validate(limit_errors=DEFAULT_LIMIT_ERRORS)

        self.signals.messages.emit(QApplication.translate("DataWorker", "Drawing table..."))

        errors = []
        if not report.valid:
            try:
                # report.error is only available for single error report
                errors.append(report.error)
            except Exception:
                errors = report.tasks[0].errors

        self.signals.messages.emit(QApplication.translate("DataWorker", "Read and Validation finished."))
        self.signals.finished.emit((self.file.path, data, errors))


class ColumnMetadataIconDelegate(QStyledItemDelegate):
    """
    Custom delegate to render an icon in the first row of the table.
    """

    dropdown_clicked = Signal(object)

    def __init__(self, icon_path, parent=None):
        super().__init__(parent)
        self.icon_size = 14
        self.icon = QIcon(icon_path)

    def _get_icon_rect(self, option):
        """Get the rectangle where the icon should be painted."""
        return QRect(
            option.rect.right() - self.icon_size,
            option.rect.top(),
            self.icon_size,
            self.icon_size,
        )

    def paint(self, painter, option, index):
        """Paint the icon in the first row of the table."""
        super().paint(painter, option, index)

        if index.row() == 0:
            self.icon.paint(painter, self._get_icon_rect(option))

    def editorEvent(self, event, model, option, index):
        """
        Handle mouse events for the icon in the first row.
        This method checks if the mouse event is over the icon and handles clicks.
        """
        if index.row() != 0:
            return super().editorEvent(event, model, option, index)

        icon_rect = self._get_icon_rect(option)

        # I am not sure about this
        if event.type() == QEvent.MouseMove:
            if icon_rect.contains(event.pos()):
                QApplication.setOverrideCursor(QCursor(Qt.PointingHandCursor))
            else:
                QApplication.setOverrideCursor(QCursor(Qt.ArrowCursor))
        elif event.type() == QEvent.MouseButtonPress:
            if icon_rect.contains(event.pos()):
                QApplication.setOverrideCursor(QCursor(Qt.ArrowCursor))
                self.handle_dropdown_click(index)
                return True

        return super().editorEvent(event, model, option, index)

    def handle_dropdown_click(self, index):
        """Handle the click on the dropdown icon."""
        self.dropdown_clicked.emit(index.column())


class FrictionlessTableModel(QAbstractTableModel):
    def __init__(self, data=[], errors=[]):
        super().__init__()
        self._data = data
        self._row_count = self._get_row_count()
        self.errors = self._get_errors(errors)
        self._column_count = self._get_column_count()

    def write_data(self, filepath: Path):
        """
        Write the data to a file in the format specified by the file extension.
        """
        extension = filepath.suffix.lower()
        if extension == ".csv":
            self.write_data_csv(filepath)
        elif extension in [".xlsx", ".xls"]:
            self.write_data_xlsx(filepath)
        else:
            raise ValueError(f"Unsupported format: {extension}. Use .csv, .xlsx or .xls")

    def write_data_csv(self, filepath: Path):
        """
        Write the data to a CSV file.
        """
        logger.info(f"Writing data to CSV file: {filepath}")
        resource = File(filepath).get_or_create_metadata().get("resource")
        dialect = resource.dialect.to_dict()
        csv_config = dialect.get("csv", None)

        # Default delimiter
        delimiter = ","
        if csv_config and "delimiter" in csv_config:
            delimiter = csv_config["delimiter"]

        with open(filepath, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile, delimiter=delimiter)
            # Write header
            writer.writerow(self._data[0])
            # Write data rows
            writer.writerows(self._data[1:])

        logger.info(f"Data saved in CSV format: {filepath}")

    def write_data_xlsx(self, filepath: Path):
        """
        Write the data to an Excel file.
        """
        logger.info(f"Writing data to Excel file: {filepath}")
        wb = Workbook()
        ws = wb.active
        # Header row
        ws.append(self._data[0])

        # Data rows
        rows = self._data[1:]
        for row in rows:
            ws.append(row)

        wb.save(filepath)
        logger.info(f"Data saved in Excel format: {filepath}")

    def _get_errors(self, errors):
        """Return an array with errors information to use when rendering the table.

        The array has same lenght as our data with None or a Tuple:
          [None, None, (3, 'blank-label', 'error mesage to be displayed'), None]

        Main actions:
         - Moves from Frictionless' 1-index to 0-index
         - Handles inconsistency in Fricionless Error Object API
         - Builds an array for easy access to error information to render performant tables.
        """
        result = [None] * self._row_count
        for error in errors:
            if error.type == "source-error":
                # SourceError happens with files that cannot be read and do not have row_number nor field_number.
                return result
            elif error.type in ["blank-label", "duplicate-label", "incorrect-label", "missing-label", "extra-label"]:
                # https://github.com/frictionlessdata/frictionless-py/issues/1710
                row = error.row_numbers[0] - 1
                column = error.field_number - 1
            elif error.type == "blank-row":
                row = error.row_number - 1
                # BlankRow error does not have field_number
                column = 0
            elif not hasattr(error, "row_number"):
                row = None
                column = None
            else:
                row = error.row_number - 1
                column = error.field_number - 1

            if row is not None:
                if result[row] is None:
                    result[row] = list()

                result[row].append((column, error.type, error.message))

        return result

    def _get_row_count(self):
        return len(self._data)

    def _get_column_count(self):
        """Get the amout of columns.

        We are expecting malformed CSVs, so the amout of columns should always
        be the size of the longest row.
        """
        try:
            return max(map(len, self._data))
        except ValueError:
            return 0

    def get_header_data(self):
        """Returns the first row of the file."""
        return self._data[0]

    def rowCount(self, parent=None):
        """Returning from a pre-calculated private attribute for performance improvements."""
        return self._row_count

    def columnCount(self, parent=None):
        """Returning from a pre-calculated private attribute for performance improvements."""
        return self._column_count

    def data(self, index, role):
        """Returns information to be used to render the Data Table View.

        For each cell we return:
         - The value to be displayed in the cell
         - If there is an error in that cell, a red color for the Background.
         - If there is an error in that cell, a message for the tooltip.
        """
        if not index.isValid():
            return None

        if role == Qt.ItemDataRole.DisplayRole or role == Qt.ItemDataRole.EditRole:
            try:
                value = self._data[index.row()][index.column()]
            except IndexError:
                # Our data could be irregular (missing columns and rows)
                # So it is okay to return None and keep iterating.
                return None
            return value

        if not self.errors[index.row()]:
            return None

        if role == Qt.ItemDataRole.BackgroundRole:
            for error_column, error_type, _ in self.errors[index.row()]:
                if error_type == "blank-row":
                    # BlankRowError does not have field_number, we paint all the cells.
                    return COLOR_RED
                if error_column == index.column():
                    return COLOR_RED
        elif role == Qt.ForegroundRole:
            for error_column, _, _ in self.errors[index.row()]:
                if error_column == index.column():
                    return QColor(255, 255, 255)

    def flags(self, index):
        """Enable edition mode"""
        if not index.isValid():
            return Qt.ItemFlag.NoItemFlags
        return super().flags(index) | Qt.ItemFlag.ItemIsEditable

    def setData(self, index, value, role):
        """Insert the edited value at the specific cell.

        Since the TableView will always have enough rows and enough columns,
        when editing the raw data we encounter two scenarios:
          a) The cell in the raw data exist and therefore we just replace
          b) The cell in the raw data do not exist and therefore we need to
          create empty cells until we get to the exact column we want to insert.
        """
        if role == Qt.ItemDataRole.EditRole:
            currentRow = self._data[index.row()]
            try:
                # a) raw cell exist
                currentRow[index.column()] = value
            except IndexError:
                # b) we create empty cells and then insert at specific column
                currentRow += [None] * (index.column() - len(currentRow))
                currentRow.insert(index.column(), value)
            return True
        return False


class DataViewer(QWidget):
    """Widget to display the content of tabular data."""

    # Signal to notify that the metadata has been saved
    on_save = Signal(object)

    def __init__(self):
        super().__init__()

        utils.set_common_style(self)

        layout = QVBoxLayout()
        self.setLayout(layout)

        self.label = QLabel()
        self.label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop)
        self.table_view = QTableView()
        # TableView's corner button hangs the application when working with huge datasets so we disable it.
        self.table_view.setCornerButtonEnabled(False)
        self.table_view.hide()

        self.delegate = ColumnMetadataIconDelegate(Paths.asset("icons/three-lines.png"))
        self.delegate.dropdown_clicked.connect(self.show_column_metadata_dialog)

        layout.addWidget(self.label)
        layout.addWidget(self.table_view)

        self.retranslateUI()

    def display_data(self, model, filepath):
        """Set the model of the QTableView

        When a tabular file is selected, the main application will create a
        FrictionlessTableModel and call this function using the model as a parametner.
        """
        self.table_view.setModel(model)

        self.table_view.setItemDelegate(self.delegate)

        self.table_view.horizontalHeader().setDefaultSectionSize(120)
        self.table_view.setMouseTracking(True)

        self.metadata = File(filepath).get_or_create_metadata()
        self.resource = self.metadata.get("resource")

        self.label.hide()
        self.table_view.show()

    def show_column_metadata_dialog(self, field_index):
        """
        Shows a dialog to edit a column's metadata.
        """
        field = self.resource.schema.fields[field_index]
        field_names = [f.name for f in self.resource.schema.fields]
        dialog = ColumnMetadataDialog(self, field, field_index, field_names)
        dialog.save_clicked.connect(self.save_metadata_to_descriptor_file)
        dialog.exec()

    def clear(self, model):
        """Reset the view to the default state.

        This view depends of the main application self.table_model attribute. This
        method should always receive an empty model
        """
        self.table_view.setModel(model)
        self.label.show()
        self.table_view.hide()

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.label.setText(self.tr("Preview not available for this item."))

    def save_metadata_to_descriptor_file(self, field_form: dict):
        """Save the metadata to the descriptor file."""
        field_index = field_form.get("index")
        field = self.resource.schema.fields[field_index]

        field.name = field_form.get("name")
        field.title = field_form.get("name")
        field.description = field_form.get("description", "")
        field.constraints = {
            "required": field_form.get("constraints").get("required"),
        }

        type = field_form.get("type")

        if type == "string":
            field.constraints["minLength"] = field_form.get("constraints").get("minLength")
            field.constraints["maxLength"] = field_form.get("constraints").get("maxLength")
        else:
            # If the type is not Text, we remove the minLength and maxLength constraints
            field.constraints.pop("minLength", None)
            field.constraints.pop("maxLength", None)

        # Update the field in the schema
        self.resource.schema.set_field(field)

        # Field.type cannot be updated directly, we need to use set_field_type
        # it needs to be after the set_field to avoid being overridden
        self.resource.schema.set_field_type(field.name, type)

        self.metadata["resource"] = self.resource.to_descriptor()
        file = File(self.resource.path)

        with open(file.metadata_path, "w") as f:
            print(f"Saving metadata {file.metadata_path}")
            json.dump(self.metadata, f)

        # Check if we name was changed, if so we need to update the header
        model = self.table_view.model()
        index = model.index(0, field_index)
        original_name = model.data(index, Qt.DisplayRole)

        table_view_changed = False
        if original_name != field.name:
            model.setData(index, field.name, Qt.EditRole)
            table_view_changed = True

        self.on_save.emit(table_view_changed)
