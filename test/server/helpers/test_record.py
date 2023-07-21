from src.server import helpers


def test_extract_records():
    names = helpers.extract_record_names(text="here my @table1 and @table2")
    assert names == ["table1", "table2"]


def test_convert_path_to_record_name():
    name = helpers.convert_path_to_record_name("some-file.csv")
    assert name == "some_file"
