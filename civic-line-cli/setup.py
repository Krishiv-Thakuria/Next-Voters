from setuptools import setup, find_packages 

setup(
    name="civic-line-cli",
    version="0.1",  
    packages=find_packages(),
    install_requires=[
        "openai",
        "psycopg2-binary",
        "requests",
        "beautifulsoup4",  
        "python-docx"
    ],
    entry_points={
        "console_scripts": [
            "civicline = civic_line:cli"
        ]
    }
)