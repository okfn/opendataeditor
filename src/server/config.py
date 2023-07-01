from typing import Optional

import attrs

from . import settings


@attrs.define(kw_only=True, repr=False)
class Config:
    folder: Optional[str] = None
    port: int = settings.DEFAULT_HTTP_PORT
    debug: bool = False
