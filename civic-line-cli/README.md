<div align="center">
  <h1>Civic Line CLI</h1>
  <p><strong>Dead simple bulk email sending for civic engagement and voter outreach.</strong></p>
</div>

---

Send professional emails to your community in seconds, not hours. Built for organizers, campaigns, and civic tech projects.

## Installation

```bash
pip install civic-line-cli
```

## Quick Start

```bash
civicline
```

That's it. The interactive CLI guides you through everything.

## How It Works

### First Run
1. Configure your SMTP settings (Gmail, Outlook, SendGrid, etc.)
2. Save credentials securely to your local machine
3. You're ready to send

### Every Run After
1. Choose to keep your saved settings or update them
2. Connect to your database with email subscribers
3. Compose and send your message

## What You'll Need

- **Email provider**: Any SMTP server (Gmail, Outlook, custom SMTP)
- **Database with contacts**: A table called `email_subscriptions` containing your recipients
  - Must include at minimum: email addresses
  - Optional: names, custom fields for personalization

## Features

✨ **Zero configuration hassle** - Interactive prompts walk you through everything  
🔐 **Secure credential storage** - Your passwords stay on your machine  
📧 **HTML emails** - Rich formatting, images, and styling  
📎 **File attachments** - Include PDFs, images, or documents  
📊 **Bulk sending** - Send to hundreds or thousands from your database  
🎨 **Email templates** - Reuse and customize pre-built templates  
⚡ **Built for speed** - Optimized for sending large volumes efficiently

## Perfect For

- Political campaigns reaching voters
- Community organizers sending updates
- Nonprofits engaging supporters
- Civic tech projects with email needs
- Any project that needs simple, powerful email sending

## Why Civic Line?

Most email tools are either:
- Too complex (requiring extensive configuration)
- Too expensive (enterprise pricing for basic sending)
- Too limited (can't handle bulk or HTML)

Civic Line gives you **enterprise email capabilities with CLI simplicity**, perfect for civic projects that need to move fast.

## Security

- Credentials are stored locally using industry-standard encryption
- No data is sent to external servers (except your email provider)
- Database connections are closed immediately after use
- All connections use secure protocols (TLS/SSL)

## Support

Found a bug? Have a feature request?  
[Open an issue](https://github.com/Next-Voters/Next-Voters/issues) or contribute on GitHub.

## License

MIT License - Build something great for your community!

---

**Built for organizers, by organizers.** Part of the [Next Voters](https://github.com/Next-Voters/Next-Voters) project.