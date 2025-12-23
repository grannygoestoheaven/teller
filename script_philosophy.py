import os
import json
from datetime import datetime

# Define the base directory
BASE_DIR = "static/stories/philosophy"

# List of subjects in snake_case
subjects = [
    "what_is_philosophy",
    "branches_of_philosophy",
    "socratic_method",
    "ancient_vs_modern_philosophy",
    "philosophy_vs_science_vs_religion",
    "philosophy_in_everyday_life",
    "reading_philosophical_texts",

    "deductive_vs_inductive_reasoning",
    "logical_fallacies",
    "propositional_logic",
    "syllogisms",
    "problem_of_induction",
    "formal_vs_informal_logic",
    "philosophical_paradoxes",

    "nature_of_reality",
    "mind_body_problem",
    "free_will_vs_determinism",
    "problem_of_universals",
    "is_time_real",
    "humes_skepticism_on_causation",
    "what_makes_you_you",

    "what_is_knowledge",
    "rationalism_vs_empiricism",
    "skepticism_can_we_know_anything",
    "a_priori_vs_a_posteriori",
    "gettier_problem",
    "perception_vs_reality",
    "kants_limits_of_knowledge",

    "virtue_ethics",
    "utilitarianism",
    "deontological_ethics",
    "moral_relativism_vs_absolutism",
    "trolley_problem",
    "existentialism_sartre_and_camus",
    "applied_ethics_ai_and_environment",

    "justice_and_rawls_veil_of_ignorance",
    "social_contract_theory",
    "liberty_vs_equality",
    "anarchism_vs_liberalism",
    "human_rights",
    "civil_disobedience",
    "role_of_government",

    "meaning_of_life",
    "death_and_mortality",
    "philosophy_of_love",
    "what_is_beauty",
    "philosophy_of_technology",
    "eastern_philosophy_buddhism_taoism",
    "can_machines_think"
]

def create_story_folders_and_files():
    # Create the base directory if it doesn't exist
    os.makedirs(BASE_DIR, exist_ok=True)

    for subject in subjects:
        # Create the subject folder
        subject_dir = os.path.join(BASE_DIR, subject)
        os.makedirs(subject_dir, exist_ok=True)

        # Generate the story title (capitalized)
        story_title = " ".join(word.capitalize() for word in subject.split("_"))

        # Create the JSON file inside the folder
        json_data = {
            "story_filename": subject,
            "story_title": story_title,
            "tagged_story_for_tts": "",
            "clean_story": "",
            "timestamp": datetime.now().strftime("%Y%m%dT%H%M%SZ")
        }

        json_file_path = os.path.join(subject_dir, f"{subject}.json")
        with open(json_file_path, "w") as json_file:
            json.dump(json_data, json_file, indent=2)

        print(f"Created: {json_file_path}")

if __name__ == "__main__":
    create_story_folders_and_files()
    print("All folders and JSON files created.")
