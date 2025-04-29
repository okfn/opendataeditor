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
