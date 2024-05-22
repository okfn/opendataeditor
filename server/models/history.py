from typing import Any, List, Literal, Union

from pydantic import BaseModel, Field
from typing_extensions import Annotated


class Change(BaseModel):
    type: Any


class RowDelete(Change):
    type: Literal["row-delete"]
    rowNumber: int


class CellUpdate(Change):
    type: Literal["cell-update"]
    rowNumber: int
    fieldName: str
    value: Any

class Cell(BaseModel):
    rowNumber: int
    fieldName: str
    value: Any

class MultipleCellUpdate(Change):
    type: Literal["multiple-cells-update"]
    cells: List[Cell]


class History(BaseModel):
    changes: List[
        Annotated[
            Union[RowDelete, CellUpdate, MultipleCellUpdate],
            Field(discriminator="type")
        ]
    ]
