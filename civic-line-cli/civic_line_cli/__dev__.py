"""Development runner - for local testing only"""

from .main import cli
import asyncio 

if __name__ == "__main__":
    asyncio.run(cli())