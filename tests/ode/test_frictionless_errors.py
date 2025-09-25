from PySide6.QtCore import Qt

from PySide6.QtWidgets import QDialog

from ode.dialogs.metadata import ColumnMetadataDialog
from ode.panels.data import ColumnMetadataField
from ode.shared import COLOR_RED


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
        assert background == COLOR_RED

        # Test FrictionlessModel do not return a Red Background for other cells.
        index = window.table_model.index(1, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != COLOR_RED

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
        assert background == COLOR_RED

        # Test FrictionlessModel do not return a Red Background for first header.
        index = window.table_model.index(0, 0)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != COLOR_RED

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
        assert background == COLOR_RED
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED
        index = window.table_model.index(2, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED

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
        assert background == COLOR_RED
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED

        # Duplicated Label should paint the cell
        index = window.table_model.index(0, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED

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
        assert background != COLOR_RED
        index = window.table_model.index(1, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED
        index = window.table_model.index(2, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED
        index = window.table_model.index(3, 2)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background == COLOR_RED

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
        assert background == COLOR_RED
        # The value of the extra cell should be "extra"
        value = window.table_model.data(index, Qt.ItemDataRole.DisplayRole)
        assert value == "extra"
        # Other cells should not be red
        index = window.table_model.index(2, 1)
        background = window.table_model.data(index, Qt.ItemDataRole.BackgroundRole)
        assert background != COLOR_RED

    def test_custom_errors_descriptions_are_shown(self, qtbot, window, project_folder):
        """Test that the application is using our custom error descriptions."""
        p1 = project_folder / "blank-row.csv"
        p1.write_text("name,age,city\nAlice,30,Barcelona\n,,\nBob,25,Valencia")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain 1 errors.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        window.content.toolbar.button_errors.click()
        # If we want to see the change in the table, we need to update the window
        window.update()
        qtbot.wait(100)
        assert window.content.errors_view.reports_layout.count() == 1
        error_report = window.content.errors_view.reports_layout.itemAt(0).widget()
        assert (
            error_report.description.text() == "This row has no data. Rows should contain at least one cell with data."
        )
        assert error_report.title_label.text() == "Empty row"

    def test_default_frictionless_errors_if_missing_custom(self, qtbot, window, project_folder):
        """Test that the application fallbacks to Frictionless errors if we do not provide a custom description."""
        p1 = project_folder / "blank-label.csv"
        p1.write_text("name,,city\nAlice,30,Barcelona\nBob,25,Valencia")

        # Simulate click event
        index = window.sidebar.file_model.index(str(p1))
        window.on_tree_click(index)

        # This file should contain 1 errors.
        qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")

        window.content.toolbar.button_errors.click()
        # If we want to see the change in the table, we need to update the window
        window.update()
        qtbot.wait(100)
        assert window.content.errors_view.reports_layout.count() == 1
        error_report = window.content.errors_view.reports_layout.itemAt(0).widget()
        # The following are Frictionless default texts: https://framework.frictionlessdata.io/docs/errors/label.html#blank-label
        assert (
            error_report.description.text()
            == "A label in the header row is missing a value. Label should be provided and not be blank."
        )
        assert error_report.title_label.text() == "Blank Label"

    def test_changing_column_header_name_fixes_error_with_dialog(self, qtbot, window, project_folder):
        """Test that changing the header name of a column with a dialog fixes the blank header error."""
        # The file should contain a blank header error
        p0 = project_folder / "temp.csv"
        p0.write_text("name,\nAlice,A\nBob,B")

        # Choose the file
        index = window.sidebar.file_model.index(str(p0))
        window.on_tree_click(index)

        # Check that the file is loaded and has an error
        qtbot.wait(100)
        assert window.content.errors_view.reports_layout.count() == 1

        # Create and show the dialog
        blank_field = ColumnMetadataField("", "string", "", {"required": False, "minLength": 0, "maxLength": 100})
        field_names = ["name", ""]
        dialog = ColumnMetadataDialog(
            parent=window, field=blank_field, field_index=1, field_names=field_names  # Index of the blank column
        )

        # Use qtbot to interact with the dialog
        qtbot.addWidget(dialog)
        dialog.show()  # For debugging purposes

        # Set the new name in the dialog
        dialog.form.name.setText("surname")

        # Verify the dialog state
        assert dialog.form.name.text() == "surname"

        # Connect to the save signal to capture the emitted data
        saved_data = []
        dialog.save_clicked.connect(lambda data: saved_data.append(data))

        # Click the save button
        qtbot.mouseClick(dialog.save_button, Qt.MouseButton.LeftButton)

        # For debugging
        # qtbot.wait(100)
        # window.update()

        # Verify the dialog was accepted and data was emitted
        assert dialog.result() == QDialog.DialogCode.Accepted
        assert len(saved_data) == 1
        assert saved_data[0]["name"] == "surname"
        assert saved_data[0]["index"] == 1
        window.content.data_view.save_metadata_to_descriptor_file(saved_data[0])

        # Wait for the changes to be applied
        qtbot.wait(1000)
        window.update()

        # Check that the error is gone
        assert window.content.errors_view.reports_layout.count() == 0

    def test_changing_column_type_with_metadata_dialog(self, qtbot, window, project_folder):
        """Test changing for and back the column type with the metadata dialog show and fixes the error."""

        # Create file
        p0 = project_folder / "temp.csv"
        p0.write_text("name,surname\nAlice,A\nBob,B")

        # Choose the file
        index = window.sidebar.file_model.index(str(p0))
        window.on_tree_click(index)

        # Check that the file is loaded and has zero error
        qtbot.wait(100)
        assert window.content.errors_view.reports_layout.count() == 0

        # Create and show the dialog
        blank_field = ColumnMetadataField(
            "surname", "string", "", {"required": False, "minLength": 0, "maxLength": 100}
        )
        field_names = ["name", "surname"]

        # We are changing the "surname" column type to "integer"
        dialog = ColumnMetadataDialog(parent=window, field=blank_field, field_index=1, field_names=field_names)

        # Use qtbot to interact with the dialog
        qtbot.addWidget(dialog)
        dialog.show()  # For debugging purposes

        dialog.form.type.setCurrentText("Number")

        # Verify the dialog state
        assert dialog.form.type.currentText() == "Number"

        # Connect to the save signal to capture the emitted data
        saved_data = []
        dialog.save_clicked.connect(lambda data: saved_data.append(data))

        # Click the save button
        qtbot.mouseClick(dialog.save_button, Qt.MouseButton.LeftButton)

        # Verify the dialog was accepted and data was emitted
        assert dialog.result() == QDialog.DialogCode.Accepted
        assert len(saved_data) == 1
        assert saved_data[0]["type"] == "number"
        assert saved_data[0]["index"] == 1

        window.content.data_view.save_metadata_to_descriptor_file(saved_data[0])

        # Wait for the changes to be applied
        qtbot.wait(1000)
        window.update()

        # Check that we have an error now
        assert window.content.errors_view.reports_layout.count() == 1

        # Change the column type back to "string" to fix the error
        dialog.form.type.setCurrentText("Text")
        qtbot.mouseClick(dialog.save_button, Qt.MouseButton.LeftButton)

        # Verify the dialog was accepted and data was emitted
        assert dialog.result() == QDialog.DialogCode.Accepted
        assert len(saved_data) == 2
        assert saved_data[1]["type"] == "string"
        assert saved_data[1]["index"] == 1

        window.content.data_view.save_metadata_to_descriptor_file(saved_data[1])

        # Wait for the changes to be applied
        qtbot.wait(1000)
        window.update()

        # Check that we have an error now
        assert window.content.errors_view.reports_layout.count() == 0
