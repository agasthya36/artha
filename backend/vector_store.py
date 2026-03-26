import chromadb
from sentence_transformers import SentenceTransformer
import os

class VectorStore:
    def __init__(self, chroma_path, collection_name, model_name='all-MiniLM-L6-v2'):
        self.client = chromadb.PersistentClient(path=chroma_path)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        self.model = SentenceTransformer(model_name)

    def search(self, query, top_k=10):
        query_embedding = self.model.encode(query).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        formatted_results = []
        if results['ids']:
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "text": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "distance": results['distances'][0][i] if 'distances' in results else None
                })
        return formatted_results

# Shared instance (initialized on demand)
_store = None

def get_vector_store():
    global _store
    if _store is None:
        data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        chroma_path = os.path.join(data_dir, "chroma")
        _store = VectorStore(chroma_path, "kannada_definitions")
    return _store
