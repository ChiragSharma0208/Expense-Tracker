import { app } from "./app.js";
import dbConnect from "./db/db.js";
dbConnect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on PORT: ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Error while running the server", err);
});
