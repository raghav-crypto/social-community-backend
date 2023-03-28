import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import app from "./app";
import "./config/passport"

async function bootServer(port: number) {
    return app.listen(PORT, () => {
        console.log(`API server listening on port ${port}`)
    })
}
const PORT = parseInt(process.env.PORT ?? "5005", 10);

bootServer(PORT)