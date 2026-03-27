import os
import requests
import yaml
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# Configuration
YML_URL = "https://raw.githubusercontent.com/alar-dict/data/master/alar.yml"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
YML_PATH = os.path.join(DATA_DIR, "alar.yml")
CHROMA_PATH = os.path.join(DATA_DIR, "chroma")
COLLECTION_NAME = "kannada_definitions"

def download_file(url, dest):
    if os.path.exists(dest):
        print(f"File already exists at {dest}")
        return
    print(f"Downloading {url}...")
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    with open(dest, "wb") as f, tqdm(
        total=total_size, unit='iB', unit_scale=True, desc=dest
    ) as pbar:
        for data in response.iter_content(chunk_size=1024):
            size = f.write(data)
            pbar.update(size)

def parse_yaml_and_ingest():
    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    # Initialize Embedding Model
    print("Loading embedding model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    print(f"Parsing {YML_PATH}...")
    with open(YML_PATH, 'r', encoding='utf-8') as f:
        # Since it's a huge YAML, we might want to parse it incrementally.
        # But let's try reading the whole thing first if possible, or use a generator.
        try:
            data = yaml.safe_load(f)
        except Exception as e:
            print(f"Error parsing YAML: {e}")
            return

    seen_ids = set()
    records = []
    print("Flattening definitions...")
    for entry in tqdm(data, desc="Flattening"):
        kannada_word = entry.get('entry', '')
        phone = entry.get('phone', '')
        word_id = entry.get('id', '')
        
        for i, d in enumerate(entry.get('defs', [])):
            def_text = d.get('entry', '')
            def_id = d.get('id', i)
            
            # Create a unique ID combining word and definition
            unique_id = f"w{word_id}_d{def_id}"
            
            if def_text and unique_id not in seen_ids:
                records.append({
                    "id": unique_id,
                    "text": def_text,
                    "metadata": {
                        "kannada": kannada_word,
                        "phone": phone,
                        "word_id": word_id,
                        "def_id": def_id,
                        "def_index": i
                    }
                })
                seen_ids.add(unique_id)

    print(f"Total unique definitions: {len(records)}")
    
    # Batch processing
    batch_size = 128
    for i in tqdm(range(0, len(records), batch_size), desc="Ingesting"):
        batch = records[i:i + batch_size]
        ids = [r['id'] for r in batch]
        texts = [r['text'] for r in batch]
        metadatas = [r['metadata'] for r in batch]
        
        embeddings = model.encode(texts, show_progress_bar=False).tolist()
        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )

if __name__ == "__main__":
    os.makedirs(DATA_DIR, exist_ok=True)
    download_file(YML_URL, YML_PATH)
    parse_yaml_and_ingest()
