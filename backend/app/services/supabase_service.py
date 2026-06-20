import os
from dotenv import load_dotenv
from supabase import create_client, Client
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    logger.warning("Supabase URL or key not found in environment variables")
    supabase: Client = None
else:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        supabase: Client = None


def get_supabase_client() -> Client:
    """
    Get the Supabase client instance.
    Returns None if client is not initialized.
    """
    return supabase


async def test_connection() -> bool:
    """
    Test the Supabase connection.
    Returns True if connection is successful, False otherwise.
    """
    if not supabase:
        return False

    try:
        # Simple query to test connection
        result = supabase.table('dummy').select('*').limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Supabase connection test failed: {e}")
        return False