# Civic Line CLI

Dead simple email sending for developers.

## Installation

```bash
pip install civic-line-cli
```

## Usage

```bash
civicline
```

That's it. The CLI walks you through everything.

## What It Does

Civic Line CLI is an interactive tool that guides you through sending emails. Just run `civicline` and follow the prompts:

1. **First run**: Configure your settings (SMTP, credentials)
2. **Subsequent runs**: Choose to change settings or keep the same (stored locally)
3. **Send emails**: Ensure your db has a table called `email_subscriptions` where you store all recipents

No flags to remember. No complex commands. Just `civicline`.

## Features

- Interactive prompts for everything
- Secure credential storage
- Email templates
- Bulk sending from CSV
- HTML email support
- File attachments
