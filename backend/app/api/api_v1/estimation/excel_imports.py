import pandas as pd
from io import StringIO
import csv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# from specification_list import codes  # Assuming you have a file named specification_list.py containing the codes
# from estimator import router

def preprocess_text(text):
    """
    Preprocesses the text by converting it to lowercase and performing other cleaning steps.
    """
    # Convert text to lower case
    text = text.lower()
    
    # Add more preprocessing steps here if necessary...
    
    return text

def find_most_similar_codes(input_descriptions, codes):
    """
    Finds the most similar code for each description in the input list.
    """
    # Preprocess and tokenize descriptions from the provided codes
    descriptions = [preprocess_text(code['description']) for code in codes]
    codes_list = [code['code'] for code in codes]

    # Preprocess the input descriptions
    input_descriptions = [preprocess_text(desc) for desc in input_descriptions]

    # Append the input descriptions to the list of existing descriptions
    all_descriptions = descriptions + input_descriptions

    # Create the TF-IDF model and fit it on all descriptions
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_descriptions)

    # Initialize an empty list to store the most similar codes
    most_similar_codes = []

    # Calculate cosine similarities and find the most similar code for each input description
    for i in range(len(descriptions), len(all_descriptions)):
        cosine_similarities = cosine_similarity(tfidf_matrix[i], tfidf_matrix[:len(descriptions)])
        most_similar_code_index = cosine_similarities.argsort()[0][-1]
        most_similar_code = codes_list[most_similar_code_index]
        most_similar_codes.append(most_similar_code)

    return most_similar_codes


def parse_csv_data(df, project_id, codes_dw):
    # Fetch specifications from the specification list
    specifications = [spec for spec in codes_dw]  # codes is imported from specification_list.py

    # Parse and preprocess each row in the DataFrame
    parsed_data = []
    for index, row in df.iterrows():
        # Skip rows with fewer than 3 columns or with no quantity value
        if len(row) < 3 or pd.isnull(row[2]):
            continue

        # description = preprocess_text(row[0]) 
        description = row[0] 
        
        unit_value = row[1].strip() if len(row) > 1 else None
        
        # Try to convert quantity to float, skip the row if it fails
        try:
            quantity = float(row[2].strip())
        except ValueError:
            continue  # Skip this row as the quantity is not a float

        # Find the most similar code for the description
        most_similar_code = find_most_similar_codes([description], specifications)[0]
        work_type = next((item['work_type'] for item in specifications if item['code'] == most_similar_code), None)
        unit = next((item['unit'] for item in specifications if item['code'] == most_similar_code), None)
        # Create a work item dictionary
        work_item = {
            'details': description +  unit_value,
            'unit': unit,
            'quantity': quantity,
            'work_code': most_similar_code,
            'work_type': work_type,
            'project_id': project_id,
            'remarks': "",
            # 'user_id': current_user.username
        }
        parsed_data.append(work_item)


    return parsed_data

