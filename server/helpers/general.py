import contextlib
import io
import json
import os
import sys
from typing import Any, Optional

from tinydb.table import Table


@contextlib.contextmanager
def capture_stdout(*, cwd: Optional[str] = None):
    prev_stdout = sys.stdout
    prev_cwd = os.getcwd()
    stdout = io.StringIO()
    try:
        sys.stdout = stdout
        os.chdir(cwd or prev_cwd)
        yield stdout
    finally:
        sys.stdout = prev_stdout
        os.chdir(prev_cwd)


class StringIndexedTable(Table):
    document_id_class = str

    def _get_next_id(self):
        raise RuntimeError("id must be provided")


def to_json(obj: Any, *, encoder_class: Optional[Any] = None) -> str:
    return json.dumps(
        obj,
        indent=2,
        ensure_ascii=False,
        cls=encoder_class,
    )
