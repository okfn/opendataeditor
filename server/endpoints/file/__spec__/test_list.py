import pathlib

import pytest

from server import helpers, models
from server.fixtures import bytes1, bytes2, folder1, name1, name2

# Action


def test_server_file_list(client):
    client("/file/create", path=name1, bytes=bytes1)
    client("/file/create", path=name2, bytes=bytes2)
    assert client("/file/list").files == [
        models.File(path=name1, type="file"),
        models.File(path=name2, type="file"),
    ]


def test_server_file_list_with_folders(client):
    client("/file/create", path=name1, bytes=bytes1)
    client("/folder/create", path=folder1)
    assert client("/file/list").files == [
        models.File(path=folder1, type="folder"),
        models.File(path=name1, type="file"),
    ]


def test_server_file_list_inside_folder(client):
    client("/folder/create", path=folder1)
    path = client("/file/create", path=name1, folder=folder1, bytes=bytes1).path
    assert client("/file/list", folder=folder1).files == [
        models.File(path=path, type="file"),
    ]


@pytest.mark.skip
def test_server_ignored_file_in_gitignore(client):
    client("/folder/create", path=folder1)
    client("/file/create", path="abc.log", folder=folder1, bytes=bytes1)
    client(
        "/file/create", path=".gitignore", bytes=pathlib.Path(".gitignore").read_bytes()
    )
    assert client("/file/list", folder=folder1).files == []


@pytest.mark.skip
def test_server_without_gitignore(client):
    client("/folder/create", path=folder1)
    path = client("/file/create", path="abc.log", folder=folder1, bytes=bytes1).path
    assert client("/file/list", folder=folder1).files == [
        models.File(path=path, type="file"),
    ]


@pytest.mark.skip
def test_server_create_file_filter(client):
    client("/folder/create", path=folder1)
    client(
        "/file/create", path=".gitignore", bytes=pathlib.Path(".gitignore").read_bytes()
    )
    is_gitignore = helpers.create_file_filter(client.project)
    assert is_gitignore("folder1/test.csv") is False
    assert is_gitignore("folder1/test.log") is True
