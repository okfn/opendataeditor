from pathlib import Path

import pytest

from server import helpers, models
from server.fixtures import bytes1, folder1, name1, name2, not_secure

# Action


def test_server_project_sync(client):
    # Create two files
    path1 = client("/file/create", path=name1, bytes=bytes1).path
    path2 = client("/file/create", path=name2, bytes=bytes1).path
    assert client("/file/list").files == [
        models.File(path=name1, type="file"),
        models.File(path=name2, type="file"),
    ]

    # Index files
    client("/file/index", path=name1)
    client("/file/index", path=name2)

    # Delete one file not using the API and sync the project
    (client.project.public / name2).unlink()
    client("/project/sync")
    assert client("/file/list").files == [
        models.File(path=name1, type="text", name="name1", errors=0),
    ]

    # It should have deleted the record of the deleted file
    assert len(list(client.project.metadata.iter_documents(type="record"))) == 1
    assert client.project.metadata.read_document(name="name2", type="record") is None
