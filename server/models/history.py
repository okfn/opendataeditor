from typing import Any, List, Literal, Union

from pydantic import BaseModel


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
    type: Literal["multiple-cell-update"]
    cells: List[Cell]


class History(BaseModel):
    changes: List[Union[RowDelete, CellUpdate, MultipleCellUpdate]]
