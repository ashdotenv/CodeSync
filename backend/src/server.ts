import server from "./app";
import { ENV } from "./config/env";


server.listen(ENV.PORT, () => {
    console.log(`Server is running in port: ${ENV.PORT}`);
})