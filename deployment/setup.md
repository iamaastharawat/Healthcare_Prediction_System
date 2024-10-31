1. Clone the repository
2. Install Node.js dependencies
   - `cd backend && npm install`
   - `cd frontend && npm install`
3. Set up MongoDB and create a `.env` file in the backend directory
4. Create training dataset: `npm run trainData`
5. Train the ML model: `npm run train`
6. Insert data in database: `npm run insertData`
7. Start flask app: `npm run flask`
8. In another terminal, start the backend server: `npm run backend`
9. For testing the ML model(unit testing): `npm run unitTestModel`
