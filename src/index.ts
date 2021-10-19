import server from "./server";

const port = 8080;

server.listen(port, () => console.log(`Running on port ${port}`));
