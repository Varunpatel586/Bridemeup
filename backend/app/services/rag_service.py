import os
import logging
from typing import List, Dict, Any, Optional
import numpy as np
from dotenv import load_dotenv

# For embedding generation, we'll use sentence-transformers
# Note: This requires installing sentence-transformers and torch
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize the embedding model
# We'll use a lightweight model for sentence embeddings
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

if SentenceTransformer is not None:
    try:
        embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        logger.info(f"Embedding model {EMBEDDING_MODEL_NAME} loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load embedding model: {e}")
        embedding_model = None
else:
    embedding_model = None
    logger.warning("sentence-transformers not installed. Embedding generation will not work.")


def get_embedding_model():
    """Get the embedding model instance."""
    return embedding_model


def generate_embedding(text: str) -> Optional[List[float]]:
    """
    Generate an embedding for the given text.
    Returns a list of floats representing the embedding, or None if model is not available.
    """
    if embedding_model is None:
        logger.error("Embedding model is not available")
        return None

    try:
        embedding = embedding_model.encode(text)
        # Convert to list of floats for JSON serialization
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Failed to generate embedding: {e}")
        return None


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculate cosine similarity between two vectors.
    """
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    if norm_vec1 == 0 or norm_vec2 == 0:
        return 0.0
    return dot_product / (norm_vec1 * norm_vec2)


async def store_document(supabase_client, content: str, metadata: Dict[str, Any] = None) -> Optional[str]:
    """
    Store a document with its embedding in Supabase.
    Returns the document ID if successful, None otherwise.
    """
    if supabase_client is None:
        logger.error("Supabase client is not available")
        return None

    embedding = generate_embedding(content)
    if embedding is None:
        return None

    try:
        # Insert document into the documents table
        # We assume a table structure: id (uuid, primary key), content (text), embedding (vector), metadata (jsonb)
        result = supabase_client.table('documents').insert({
            'content': content,
            'embedding': embedding,
            'metadata': metadata or {}
        }).execute()

        if result.data and len(result.data) > 0:
            doc_id = result.data[0]['id']
            logger.info(f"Document stored with ID: {doc_id}")
            return doc_id
        else:
            logger.error("Failed to store document: no data returned")
            return None
    except Exception as e:
        logger.error(f"Failed to store document in Supabase: {e}")
        return None


async def query_similar_documents(supabase_client, query_text: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Query Supabase for documents similar to the query text.
    Returns a list of documents with their content and metadata.
    """
    if supabase_client is None:
        logger.error("Supabase client is not available")
        return []

    query_embedding = generate_embedding(query_text)
    if query_embedding is None:
        return []

    try:
        # We'll use Supabase's vector similarity search via the match_vectors function (if using pgvector)
        # Alternatively, we can fetch all documents and compute similarity locally (not efficient for large datasets)
        # For now, we'll do a simple approach: fetch all and compute similarity (only for small datasets)
        # In production, you would use pgvector extension and the match_vectors function.

        # Fetch all documents (this is inefficient for large datasets)
        result = supabase_client.table('documents').select('id, content, embedding, metadata').execute()

        if not result.data:
            return []

        # Compute similarity for each document
        similarities = []
        for doc in result.data:
            if doc['embedding'] is not None:
                similarity = cosine_similarity(query_embedding, doc['embedding'])
                similarities.append((similarity, doc))

        # Sort by similarity (descending)
        similarities.sort(key=lambda x: x[0], reverse=True)

        # Return top `limit` documents
        top_docs = [doc for _, doc in similarities[:limit]]
        return top_docs

    except Exception as e:
        logger.error(f"Failed to query similar documents: {e}")
        return []


async def get_rag_context(supabase_client, query_text: str, limit: int = 3) -> str:
    """
    Get a context string for RAG by querying similar documents and combining their content.
    Returns a concatenated string of the top documents' content.
    """
    similar_docs = await query_similar_documents(supabase_client, query_text, limit)
    if not similar_docs:
        return ""

    # Combine the content of the top documents
    context_parts = []
    for doc in similar_docs:
        content = doc.get('content', '')
        if content:
            context_parts.append(content)

    return "\n\n".join(context_parts)