import json

from ode.paths import Paths


def migrate_metadata_store():
    """Migrates all the metadata information to separated files.

    Previously ODE stored the Frictionless metadata (and some more info) of
    every file in a single "records" dictionary stored in a metadata.json.
    This created several issues like: custom logic to deduplicate file names,
    a third database to link files with records, etc.

    We will now store metadata on independent files under a `.metadata` folder.
    Each file will have the same name of the original file with a `.json` append.
    We will also mimic the folder structure.
    """
    # Path to the original metadata.json file
    metadata_file_path = Paths.PROJECT_PATH / '.opendataeditor/metadata.json'

    if not metadata_file_path.exists():
        print("There is no current metadata.json file to migrate. Skipping.")
        return

    with open(metadata_file_path, 'r') as file:
        metadata = json.load(file)
    records = metadata['record']

    metadata_dir = Paths.PROJECT_PATH / '.metadata/'
    metadata_dir.mkdir(exist_ok=True)

    for record_id, record_data in records.items():
        file_path = record_data['path']
        json_file_path = metadata_dir / f"{file_path}.json"
        # Ensure the directory structure exists
        json_file_path.parent.mkdir(parents=True, exist_ok=True)

        with open(json_file_path, 'w') as json_file:
            json.dump(record_data, json_file, indent=4)
    print("Migration completed successfully!")
