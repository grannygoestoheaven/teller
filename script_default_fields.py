from pathlib import Path
from src.config.settings import STATIC_DIR
from src.data.fields.default_fields import main_sub_fields  # <-- Moved to src/data/

def create_js_file(field_name, full_subjects, compact_subjects):
    field_dir = STATIC_DIR / "subjects" / "fields" / field_name
    field_dir.mkdir(parents=True, exist_ok=True)

    js_content = f"const fullSubjects = [\n"
    js_content += ',\n    '.join(f'    \"{item}\"' for item in full_subjects) + "\n];\n\n"
    js_content += f"const compactSubjects = [\n"
    js_content += ',\n    '.join(f'    \"{item}\"' for item in compact_subjects) + "\n];\n\n"
    js_content += "export { fullSubjects, compactSubjects };"

    js_path = field_dir / f"{field_name.lower().replace(' ', '_')}Basics.js"
    with open(js_path, 'w') as file:
        file.write(js_content)
    return js_path

# Generate files
for field_name, subjects in main_sub_fields.items():
    create_js_file(field_name, subjects["full"], subjects["compact"])

print("All files created in static/subjects/fields/")
