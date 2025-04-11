from PySide6.QtCore import Qt
from PySide6.QtGui import QColor


class TestFrictionlessErrors:
    """Test that FrictionlessTableModel returns correct background for errors.

    Our main QTableView calls the data() endpoint of our table_model with
    Qt.ItemDataRole.BackgroundRole to request wich color should the cell be painted.
    We also assume that if the value returned is QColor("red") then the table will be
    displayed properly.
    """

    def test_blank_header_error(self, qtbot, window, project_folder):
        p1 = project_folder / "blank-header.csv"
        p1.write_text("name,\nAlice,30\nBob,25")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain only 1 error.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        # Test FrictionlessModel returns a Red Background for the error cell.
        index = window.table_model.index(0, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

        # Test FrictionlessModel do not return a Red Background for other cells.
        index = window.table_model.index(1, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != QColor("red")

    def test_duplicate_label_error(self, qtbot, window, project_folder):
        p1 = project_folder / "duplicate-label.csv"
        p1.write_text("name,name\nAlice,30\nBob,25")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain only 1 error.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        # Test FrictionlessModel returns a Red Background for the error cell.
        index = window.table_model.index(0, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

        # Test FrictionlessModel do not return a Red Background for first header.
        index = window.table_model.index(0, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != QColor("red")

    def test_blank_row_error(self, qtbot, window, project_folder):
        p1 = project_folder / "blank-row.csv"
        p1.write_text("name,age,city\nAlice,30,Barcelona\n,,\nBob,25,Valencia")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain only 1 error.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        # Blank Row error should paint the whole row in red.
        index = window.table_model.index(2, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        index = window.table_model.index(2, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

    def test_blank_row_and_duplicated_label_error(self, qtbot, window, project_folder):
        p1 = project_folder / "blank-row-and-duplicated-label.csv"
        p1.write_text("name,name\nAlice,30\n,\nBob,25")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain only 2 errors: blank row and duplicated label.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "2")

        # Blank Row error should paint the whole row in red.
        index = window.table_model.index(2, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

        # Duplicated Label should paint the cell
        index = window.table_model.index(0, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

    def test_missing_cell_error(self, qtbot, window, project_folder):
        p1 = project_folder / "missing-cell.csv"
        p1.write_text("name,age,city\nAlice,30\nBob,25\nTom,15")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain 3 errors.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "3")

        # Missing Cell should paint the third column (except the header).
        index = window.table_model.index(0, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != QColor("red")
        index = window.table_model.index(1, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        index = window.table_model.index(2, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        index = window.table_model.index(3, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")

    def test_extra_cell_error(self, qtbot, window, project_folder):
        p1 = project_folder / "extra-cell.csv"
        p1.write_text("name,age\nAlice,30\nBob,25,extra\nTom,15")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain 1 errors.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        # Extra Cell should paint the extra cell.
        index = window.table_model.index(2, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == QColor("red")
        # The value of the extra cell should be "extra"
        value = window.table_model.data(index, Qt.ItemDataRole.DisplayRole)
        assert value == "extra"
        # Other cells should not be red
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != QColor("red")
