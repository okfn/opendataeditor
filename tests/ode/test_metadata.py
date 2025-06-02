from PySide6.QtCore import Qt


class TestMetadata:
    def test_changing_type_error(self, qtbot, window, project_folder):
        """Test that changing the type of a column to an incompatible type
        raises an error in the metadata view.
        """
        p0 = project_folder / "temp.csv"
        p0.write_text("name,age\nAlice,30\nBob,25")

        # Choose the file
        index = window.sidebar.file_model.index(str(p0))
        window.on_tree_click(index)

        # Wait for the file to be loaded
        qtbot.wait(100)

        # Check we don't have any errors
        assert window.content.errors_view.reports_layout.count() == 0

        # Change the metadata type of the first column to integer
        window.content.metadata_widget.forms[1].field_forms[0].types.setCurrentText("integer")
        window.content.toolbar.button_save.click()
        qtbot.wait(100)

        # Check we have an error
        assert window.content.errors_view.reports_layout.count() == 1
        proxy_model = window.content.errors_view.reports_layout.itemAt(0).widget().proxy_model
        assert proxy_model.error_type == "type-error"

        # Revert the change to string
        window.content.metadata_widget.forms[1].field_forms[0].types.setCurrentText("string")
        window.content.toolbar.button_save.click()
        qtbot.wait(100)

        # We can check the error is gone by checking the error label
        # window.content.toolbar.button_errors.click()
        # If we want to see the change in the table, we need to update the window
        # window.update()

        assert window.content.errors_view.reports_layout.count() == 0

    def test_changing_required_to_true(self, qtbot, window, project_folder):
        """Test that changing the required field to True raises an error"""
        p0 = project_folder / "temp.csv"
        p0.write_text("name,age\nAlice,30\nBob,")

        # Choose the file
        index = window.sidebar.file_model.index(str(p0))
        window.on_tree_click(index)

        # Wait for the file to be loaded
        qtbot.wait(100)

        # Check we don't have any errors
        assert window.content.errors_view.reports_layout.count() == 0

        # Change the metadata type of the first column to integer
        window.content.metadata_widget.forms[1].field_forms[1].constraint_required.setCurrentText("True")
        window.content.toolbar.button_save.click()
        qtbot.wait(100)

        # We want to check in the metadata view that the change is reflected
        # We go to the Column Fields form
        window.content.metadata_widget.forms_layout.setCurrentIndex(1)
        window.content.toolbar.button_metadata.click()
        qtbot.wait(100)

        # We can check the error is gone by checking the error label
        # window.content.toolbar.button_errors.click()
        # window.update()
        # qtbot.wait(100)

        # Check we have an error
        assert window.content.errors_view.reports_layout.count() == 1
        proxy_model = window.content.errors_view.reports_layout.itemAt(0).widget().proxy_model
        assert proxy_model.error_type == "constraint-error"

        # Revert the change to False
        window.content.metadata_widget.forms[1].field_forms[1].constraint_required.setCurrentText("False")
        window.content.toolbar.button_save.click()
        qtbot.wait(100)

        # We can check the error is gone
        assert window.content.errors_view.reports_layout.count() == 0

    def test_file_with_a_missing_header(self, qtbot, window, project_folder):
        """
        Test that a file with a missing header raises an error and allows
        the user to fix it by adding the missing header in the metadata view.

        The process is as follows:
        1. Create a CSV file with a missing header.
        2. Load the file in the application.
        3. Check that an error is reported in the errors view.
        4. Check that the metadata schema has two headers (the existing ones).
        5. Add the missing header in the data
        6. Save the file
        7. Check that the error is gone and the metadata schema is updated with the new header.
           It should have three columns now.
        """
        p0 = project_folder / "temp.csv"
        headers = ["name", "age"]
        p0.write_text(f"{headers[0]},{headers[1]}\nAlice,30,f\nBob,30,m")

        # Choose the file
        index = window.sidebar.file_model.index(str(p0))
        window.on_tree_click(index)

        # Wait for the file to be loaded
        qtbot.wait(100)

        # Check we have one error report
        assert window.content.errors_view.reports_layout.count() == 1
        proxy_model = window.content.errors_view.reports_layout.itemAt(0).widget().proxy_model
        assert proxy_model.error_type == "extra-cell"

        # Check we have two columns in the metadata schema.columns because we have two headers
        assert len(headers) == len(window.content.metadata_widget.forms[1].field_forms)
        for i, header in enumerate(headers):
            assert header == window.content.metadata_widget.forms[1].field_forms[i].name.text()

        # If we add the missing header, we should not have any errors
        index = window.table_model.index(0, 2)  # Get the index of the label we want to change
        new_header = "gender"
        window.table_model.setData(index, new_header, Qt.ItemDataRole.EditRole)
        window.content.toolbar.button_save.click()

        window.update()  # Refresh the errors view
        qtbot.wait(100)  # Wait for the errors view to update

        # Check we don't have any errors
        assert window.content.errors_view.reports_layout.count() == 0

        # Check we have a new column in the metadata schema.columns
        assert len(window.content.metadata_widget.forms[1].field_forms) == 3
        assert window.content.metadata_widget.forms[1].field_forms[2].name.text() == new_header
