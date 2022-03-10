import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const config  = {
    type: process.env.TYPEORM_CONNECTION,
    

}

export default config;