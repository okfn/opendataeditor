def test_file_is_displayed(qtbot, window, project_folder):
    p1 = (project_folder / "example.csv")
    p1.write_text("name,age\nAlice,30\nBob,25")

    # Assert Welcome screen is selected by default.
    assert window.main_layout.currentIndex() == 0
    assert window.content.data_view.isVisible() is False

    # Simulate click event
    index = window.sidebar.file_model.index(str(p1))
    window.on_tree_click(index)

    qtbot.waitUntil(lambda: window.main_layout.currentIndex() == 1)
    assert window.main_layout.currentIndex() == 1
    assert window.content.data_view.isVisible()

    # Test our TableView model has 3 rows and 2 columns (data was loaded properly)
    assert window.content.data_view.table_view.model().rowCount() == 3
    assert window.content.data_view.table_view.model().columnCount() == 2


def test_button_errors_displays_error_count(qtbot, window, project_folder):
    p1 = (project_folder / "missing-header.csv")
    p1.write_text("name,\nAlice,30\nBob,25")

    # Simulate click event
    index = window.sidebar.file_model.index(str(p1))
    window.on_tree_click(index)

    qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")
    error_report = window.content.errors_view.reports_layout.takeAt(0)
    error_text = error_report.widget().description.text()

    # Test Frictionless error
    assert "Label should be provided and not be blank." in str(error_text)
