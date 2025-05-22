# Leave Management System - Server Backend

## Overview
An Express.js backend repo application written in TypeScript that enables employees to submit leave requests and managers to review/approve them. Connects to a secure React.js frontend with Bootstrap styling. This application ensures secure data handling and user authentication through JWT, providing a seamless experience.

This is the backend server for the Leave Management System. It handles all the API requests and manages the data for the application.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd leave-management-system/server
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the server, run:
```bash
npm run dev
```

The server will run on `http://localhost:3000` (or the specified port in your configuration).

## API Endpoints

- **GET /api/leaves**: Retrieve all leave requests.
- **POST /api/leaves**: Create a new leave request.
- **PUT /api/leaves/:id**: Update a leave request.
- **DELETE /api/leaves/:id**: Delete a leave request.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
