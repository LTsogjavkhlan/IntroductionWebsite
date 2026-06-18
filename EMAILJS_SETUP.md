4. Set up your template with these variables:
   ```
   Subject: Contact from {{name}} - {{subject}}
   
   Content:
   Name: {{name}}
   Phone: {{phone}}
   Email: {{email}}
   Subject: {{subject}}
   
   Message:
   {{message}}
   ``` 

## Template Variables Reference

Your EmailJS template should include these variables:
- `{{name}}` - Sender's name
- `{{phone}}` - Sender's phone number
- `{{email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Message content
- `{{to_email}}` - Your email (recipient) 