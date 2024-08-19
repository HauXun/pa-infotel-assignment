# PA Infotel Hotel Booking Backend Assignment

## Introduction

This project is a backend for a hotel booking application, implemented using NestJS. This project demonstrates how to build a robust backend for a hotel booking system using modern technologies and best practices in user authentication. The use of JWT, refresh-token rotation, and OAuth ensures the system is secure and user-friendly.

The application features:

- User authentication, including JWT-based authentication, refresh-token rotation, and Google OAuth login.
- Booking XML processing, including xml-processing-without-lib and xml-processing-with-lib
- Vietcombank Payment integration

## Note

For the best experience, I would recommend the following tools for testing api:
- Tools: Postman, Thunder Client Extension
- Browser: Google Chrome, Microsoft Edge

## Technologies Used

- **NestJS:** Framework for building efficient and scalable server-side applications.
- **Mongoose:** ORM for MongoDB integration.
- **JWT:** JSON Web Tokens for secure authentication.
- **Bcrypt:** Library for hashing passwords.
- **Passport:** Middleware for handling authentication.
- **Swagger:** Integrated for API documentation.
- **fast-xml-parser:** Using fast-xml-parser to parse XML.
- **Axios:** Library for API call.

## Design Choices

- **JWT Authentication:** JWT is chosen for stateless authentication. Tokens are stored in HTTP-only cookies to mitigate XSS attacks.
- **Refresh Token Rotation:** To enhance security, the refresh token is rotated every time it is used to issue a new access token.
- **Google OAuth:** Google login is integrated to allow users to authenticate using their Google account.
- **`parseXmlNode` Algorithm:** The `parseXmlNode` algorithm is designed to recursively convert an XML structure into a JSON-like object.

## API Endpoints

- **POST /auth/signup:** Register a new user.
- **POST /auth/login:** Login with email and password.
- **POST /auth/refresh-token:** Refresh access token using refresh token.
- **GET /auth/google:** Redirect to Google for authentication.
- **GET /auth/google/callback:** Google login callback.

- **GET /booking/{confirmation_no}:** Booking XML convert processing.

- **GET /payment-success:** Redirect to server for handle payment success.
- **GET /payment-fail:** Redirect to server for handle payment failed.
- **POST /payment/{confirmation_no}:** Create a new payment with Vietcombank.
- **POST /payment/check-order/{token_code}:** API to check the status of previously paid orders.
- **POST /payment/check-bankcode/all:** API allows to get information about the list of banks that allow payment in case of payment by ATM card, Internet Banking, QRCode, Transfer,....

## Refresh-Token Implementation

- Access and refresh tokens are stored as HTTP-only cookies.
- Upon access token expiration, the refresh token is used to generate a new token pair.
- Refresh tokens are rotated to enhance security, mitigating the risk of replay attacks.

## `parseXmlNode` Algorithm Implementation

### Overview:

This design ensures that the algorithm is both efficient and flexible, capable of converting complex XML documents into JSON with minimal overhead.

### How It Works:

1. **Node Type Identification**: The algorithm first checks the type of the XML node:

   - **Element Node (nodeType 1)**: If the node is an element, it processes its attributes (if any) and stores them under the `@attributes` key.
   - **Text Node (nodeType 3)**: If the node is a text node, it stores the text value directly.

2. **Child Nodes Processing**: If the XML node has child nodes, the algorithm iterates through each child node and processes it recursively:

   - If a child node with a given name does not already exist in the result object, it is added directly.
   - If a child node with the same name already exists, it converts the existing node into an array and appends the new node to this array. This allows the algorithm to handle multiple nodes with the same name.

3. **Recursive Parsing**: The algorithm calls itself recursively for each child node, building up the JSON object by traversing the entire XML tree structure.

### Big-O Complexity:

- **Time Complexity**: The time complexity of the `parseXmlNode` algorithm is **O(n)**, where `n` is the total number of nodes in the XML document. This is because each node is visited exactly once during the recursive traversal.
- **Space Complexity**: The space complexity is also **O(n)**, primarily due to the recursive call stack and the space required to store the resulting JSON object.

### Design Choices:

- **Recursion**: The algorithm uses recursion to naturally handle the hierarchical structure of XML documents. This makes it easier to manage nested nodes and attributes without needing to explicitly maintain a stack or queue.
- **Dynamic Object Construction**: The use of dynamic object keys allows the algorithm to handle XML nodes with arbitrary names and structures, making it flexible and adaptable to various XML schemas.
- **Handling Multiple Nodes with the Same Name**: By converting nodes with the same name into arrays, the algorithm can accurately represent XML structures where multiple sibling elements have the same tag name.

## How to Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env.dev` file with the necessary environment variables (as listed in the github repository).
4. Run `npm run start:dev` to start the application.
5. Visit `http://localhost:3000/api` to view the Swagger UI.
