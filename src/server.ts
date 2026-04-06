import app from './app';
import { initializeDatabase } from './db/init';

// using 3000 if no port is there
var PORT = process.env.PORT || 3000;

// this function starts the whole server!
const startServer = () => {
    // Ensure database is initialized before starting the server
    // it broke without this before so don't delete!
    try {
        initializeDatabase();
        console.log("DB init seems to be working, let's go!");
    } catch (err) {
        console.error('Failed to initialize database (oh no):', err);
        // exit the process if it fails
        process.exit(1);
    }

    // start listening on the port
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log("yay, app started successfully!!");
    });
};

// run the function
startServer();
