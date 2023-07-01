import typer

from . import settings
from .config import Config
from .server import Server


def main(
    folder: str = typer.Argument(
        default=None,
        help="Project folder [default: current]",
    ),
    # Options
    port: int = typer.Option(
        settings.DEFAULT_HTTP_PORT,
        help="Specify server port",
    ),
    debug: bool = typer.Option(
        default=False,
        help="Enable debug mode",
    ),
):
    config = Config(
        folder=folder,
        port=port,
        debug=debug,
    )
    server = Server.create(config)
    server.run()


if __name__ == "__main__":
    typer.run(main)
