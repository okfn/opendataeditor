from PySide6.QtCore import Qt

from ode.shared import COLOR_RED


def test_file_is_displayed(qtbot, window, project_folder):
    p1 = project_folder / "example.csv"
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

    # Test our TableView model has 2 rows (because we removed the header) and 2 columns (data was loaded properly)
    assert window.content.data_view.table_view.model().rowCount() == 2
    assert window.content.data_view.table_view.model().columnCount() == 2


def test_button_errors_displays_error_count(qtbot, window, project_folder):
    p1 = project_folder / "missing-header.csv"
    p1.write_text("name,\nAlice,30\nBob,25")

    # Simulate click event
    index = window.sidebar.file_model.index(str(p1))
    window.on_tree_click(index)

    qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "1")
    error_report = window.content.errors_view.reports_layout.takeAt(0)
    error_text = error_report.widget().description.text()

    # Test Frictionless error
    assert "Label should be provided and not be blank." in str(error_text)


def test_error_reports_show_two_blank_lines_in_red(qtbot, window, project_folder):
    """Test that two blank lines are shown in red in the error report."""
    p1 = project_folder / "two-blank-lines.csv"
    p1.write_text("name,surname\n,\n,")

    # Simulate click event
    index = window.sidebar.file_model.index(str(p1))
    window.on_tree_click(index)

    qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "2")
    # Get error report
    error_report = window.content.errors_view.reports_layout.takeAt(0)

    proxy = error_report.widget().proxy_model
    total_rows = proxy.rowCount()
    red_rows = 0
    red_background = COLOR_RED.name()

    for row in range(total_rows):
        # Get the proxy index for this row
        index = proxy.index(row, 0)

        # Get background color
        background_color = proxy.data(index, Qt.BackgroundRole)

        # If the color is red, increment counter
        if background_color is not None and background_color.name() == red_background:
            red_rows += 1

    assert red_rows == 2


def test_error_reports_show_two_errors_in_same_row(qtbot, window, project_folder):
    """
    This test is for the case where there are two errors in the same row, and
    both errors are shown in red.

    Error 1: Duplicated header
    Error 2: Empty header
    """
    p1 = project_folder / "header-errors.csv"
    p1.write_text("name,name,,empty\nname,surname,empty,empty")

    # Simulate click event
    index = window.sidebar.file_model.index(str(p1))
    window.on_tree_click(index)

    qtbot.waitUntil(lambda: window.content.toolbar.button_errors.error_label.text() == "2")

    red_background = COLOR_RED.name()

    # Check that we have two error report tables
    assert window.content.errors_view.reports_layout.count() == 2

    # Check we have on error in each report
    # Error 1: Duplicated header
    proxy_model = window.content.errors_view.reports_layout.itemAt(0).widget().proxy_model
    assert proxy_model.error_type == "duplicate-label"
    # Check the exact column
    index = proxy_model.index(0, 1)
    background_color = proxy_model.data(index, Qt.BackgroundRole)
    assert background_color.name() == red_background

    # Error 2: Empty header
    proxy_model = window.content.errors_view.reports_layout.itemAt(1).widget().proxy_model
    assert proxy_model.error_type == "blank-label"
    # Check the exact column
    index = proxy_model.index(0, 2)
    background_color = proxy_model.data(index, Qt.BackgroundRole)
    assert background_color.name() == red_background
