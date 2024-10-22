# Smart Memory NodeJS Backend API
## Introduction
This project provides a NodeJS backend API that serves as the data source for the React frontend application. The API enables the frontend to 
manage user-specific data, such as their URL library and other resources, as well as retrieve answers for the AI interactions by making HTTP requests.

## How the Frontend React App Uses This API
The React frontend interacts with this backend via HTTP requests using the Fetch API.

Example usage: The frontend makes a POST request to /api/sources/ to save a new URL inputted by the user.
```
const response = await fetch('/api/sources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urlInput }),
    });
```

## Backend API Endpoints
### Get all source URLs in the user’s library
`GET /api/sources/`

#### Response:
```
<HTTP STATUS CODE 200>
{
  {
    “id”: 0, 
    “url”: “https://www.allrecipes.com/butternut-squash-chili-recipe-8725719”
  },
  {
    “id”: 1,
    “url”: “https://medium.com/data-science-at-microsoft/forget-rag-embrace-agent-design-for-a-more-intelligent-grounded-chatgpt-6c562d903c61”
  }
}
```
---
### Post source URLs from the user
`POST /api/sources/`

#### Request body:
```
{
  “0”: “https://www.allrecipes.com/butternut-squash-chili-recipe-8725719”,
  “1”: “https://medium.com/data-science-at-microsoft/forget-rag-embrace-agent-design-for-a-more-intelligent-grounded-chatgpt-6c562d903c61”,
  “2”: “https://www.sciencedaily.com/releases/2015/05/150519164859.htm”
}
```

#### Response:
```
<HTTP STATUS CODE 201>
{
  "message": “URLs received successfully!”
}
```
---
### Delete source URL from the database
`DELETE /api/sources/`

#### Response:
```
<HTTP STATUS CODE 201>
{
  "message": “URL deleted successfully!”
}
```
---
### Get chat history of user's messages and the assistant's responses
`GET /api/messages`

#### Response:
```
<HTTP STATUS CODE 200>
{
  {
    “id”: 0, 
    “userMessage”: “how many cans of beans should I buy for the chili recipe?”,
    "assisstantResponse": “The chili recipe requires 1 can of beans, so 1 can would be best.”
  },
  {
    “id”: 1, 
    “userMessage”: “when is the chili ready to take off the stove?”,
    "assisstantResponse": "After the chili has boiled on medium heat for 5 minutes, it will be a
                          thicker consistency. At that point you can turn off the stove and move the chili."
  }
}
```
---
### Post user's message from the chat 
`POST /api/messages/`

#### Request body:
```
{
  “message”: “how many cans of beans do I need for the chili recipe?”
}
```

#### Response:
```
<HTTP STATUS CODE 201>
{
  "response": “The chili recipe requires 1 can of beans.”
}
```
