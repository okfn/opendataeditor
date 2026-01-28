## Documentation

Documentation is written with [Sphinx](https://www.sphinx-doc.org/en/master/) (in the `docs` directory). The source files are in the `docs/source/` directory. To locally build the documentation, you can execute:

```bash
uv run build.py docs
```

or

```bash
# With the virtual environment activated
python build.py docs
```

It will be automatically published on CloudFlare when merged to the `main`branch, with previews available for pull requests.
