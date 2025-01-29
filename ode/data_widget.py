from frictionless import validate, Resource, system

from PySide6.QtGui import QColor
from PySide6.QtCore import Qt, QAbstractTableModel, QObject, Signal, Slot, QRunnable


class WorkerSignals(QObject):
    """Define the signals for the File Reader worker."""
    data = Signal(tuple)


class Worker(QRunnable):
    def __init__(self, filepath):
        super().__init__()
        self.filepath = filepath
        self.signals = WorkerSignals()

    @Slot()
    def run(self):
        """Sets the two dimension array of data.

        We are using Resource.read_cells() because we want to read the data
        as is in the file in order to properly show data errors.

        We are using the system context to allow us to read from non-relative paths.
        """
        with system.use_context(trusted=True):
            data = Resource(self.filepath).read_cells()

        with system.use_context(trusted=True):
            report = validate(self.filepath)

        errors = []
        if not report.valid:
            try:
                errors.append(report.error)
            except Exception:
                # self.report.error is only available for single error report
                errors = report.tasks[0].errors
        self.signals.data.emit((self.filepath, data, report, errors))


class FrictionlessTableModel(QAbstractTableModel):
    def __init__(self, data=[], report=[], errors=[]):
        super().__init__()
        self._data = data
        self.report = report
        self.errors = errors
        self._row_count = self._set_row_count()
        self._column_count = self._set_column_count()

    def write_data(self):
        """Writes data back to the file."""
        with system.use_context(trusted=True):
            source = Resource(self._data)
            source.write(self.filepath)

    def _get_error_row_number(self, error):
        """Return the row number from the Error object

        Errors objects in frictionless-py do not have a consistent API. This method
        encapsulates the logic to retrieve them. It also moves from 1-index to 0-index.
        """
        if error.type == 'blank-label':
            result = error.row_numbers[0] - 1
        else:
            result = error.row_number - 1
        return result

    def _set_row_count(self):
        return len(self._data)

    def _set_column_count(self):
        """Set the amout of columns.

        We are expecting malformed CSVs, so the amout of columns should always
        be the size of the longest row.
        """
        try:
            return max(map(len, self._data))
        except ValueError:
            return 0

    def rowCount(self, parent=None):
        """Returning from a pre-calculated private attribute for performance improvements."""
        return self._row_count

    def columnCount(self, parent=None):
        """Returning from a pre-calculated private attribute for performance improvements."""
        return self._column_count

    def data(self, index, role):
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
        if role == Qt.ItemDataRole.BackgroundRole:
            for error in self.errors:
                error_row = self._get_error_row_number(error)
                if error_row == index.row():
                    if error.type == 'blank-row':
                        # BlankRowError does not have field_number, we paint all the cells.
                        return QColor('red')
                    error_column = error.field_number - 1
                    if error_column == index.column():
                        return QColor('red')
        if role == Qt.ItemDataRole.ToolTipRole:
            for error in self.errors:
                error_row = self._get_error_row_number(error)
                if error_row == index.row():
                    if error.type == 'blank-row':
                        # BlankRowError does not have field_number, we add tooltip to all the cells.
                        return error.message
                    error_column = error.field_number - 1
                    if error_column == index.column():
                        return error.message

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
