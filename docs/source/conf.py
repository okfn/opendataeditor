# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "Open Data Editor"
copyright = "2025, Open Knowledge Foundation"
author = "Open Knowledge Foundation"
release = "1.7.1"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "myst_parser",
    "sphinx_rtd_theme",
]

myst_enable_extensions = [
    "colon_fence",  # Admonitions
]

templates_path = ["_templates"]
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]

# -- Internationalization  ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/advanced/intl.html#translating-with-sphinx-intl

locale_dirs = ["locale/"]  # path is example but recommended.
gettext_compact = False  # optional.

# Expose current language to templates
# language variable is set via -Dlanguage=<locale> and is available at template time
html_context = {
    # Language will be accessible as 'lang' in templates
    # It defaults to 'en' when not specified
}
