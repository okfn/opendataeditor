#!/Users/Polina_Ganina/Desktop/Iamfrontender/projects_ongo/frictionlessdata/.python/bin/python3

import argparse
import sys
import os
import re

from yaml import safe_load

from tableschema_to_template.errors import Ts2xlException
from tableschema_to_template import create_xlsx


def _xlsx_path(s):
    if os.path.exists(s):
        raise Ts2xlException(f'"{s}" already exists')
    if not s.endswith('.xlsx'):
        raise Ts2xlException(f'"{s}" does not end with ".xlsx"')
    return s


def _make_parser():
    parser = argparse.ArgumentParser(
        description='''
Given a Frictionless Table Schema,
generates an Excel template with input validation.
''')
    doc_dict = _doc_to_dict(create_xlsx.__doc__)
    parser.add_argument(
        'schema_path', type=argparse.FileType('r'),
        metavar='SCHEMA',
        help='Path of JSON or YAML Table Schema.')
    parser.add_argument(
        'xlsx_path', type=_xlsx_path,
        metavar='EXCEL',
        help=doc_dict['xlsx_path'])
    parser.add_argument(
        '--sheet_name',
        metavar='NAME',
        help=doc_dict['sheet_name'])
    parser.add_argument(
        '--idempotent',
        action='store_true',
        help=doc_dict['idempotent'])
    return parser


def _doc_to_dict(doc):
    '''
    Given google style docs, parse out the arguments,
    and return a dict.

    >>> _doc_to_dict('... Args: fake_arg: It works! Returns: ...')
    {'fake_arg': 'It works!'}
    '''
    arg_lines = re.search(
        r'(?<=Args:)(.+)(?=Returns:)', doc,
        flags=re.DOTALL
    ).group(0).strip().split('\n')
    arg_matches = [
        re.match(r'^\s*(\w+):\s+(\S.*)', arg.strip())
        for arg in arg_lines
    ]
    return {m.group(1): m.group(2) for m in arg_matches}


# We want the error handling inside the __name__ == '__main__' section
# to be able to show the usage string if it catches a Ts2xlException.
# Defining this at the top level makes that possible.
_parser = _make_parser()


def main():
    args = vars(_parser.parse_args())
    schema_path = args.pop('schema_path')
    table_schema = safe_load(schema_path.read())
    xlsx_path = args.pop('xlsx_path')
    create_xlsx(table_schema, xlsx_path, **args)

    print(f'Created {xlsx_path}', file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        exit_status = main()
    except Ts2xlException as e:
        print(_parser.format_usage(), file=sys.stderr)
        print(e, file=sys.stderr)
        exit_status = 2
    sys.exit(exit_status)
