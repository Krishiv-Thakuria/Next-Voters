from setuptools import setup, find_packages 

setup(
    name="civic_line_cli",
    version="0.4",  
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
            "civicline = civic_line_cli:cli"
        ]
    }
)