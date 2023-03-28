import "dotenv/config";
import app from "./app";

async function bootServer(port: number) {
    return app.listen(PORT, () => {
        console.log(`API server listening on port ${port}`)
    })
}

const PORT = parseInt(process.env.PORT ?? "5005", 10);

bootServer(PORT)