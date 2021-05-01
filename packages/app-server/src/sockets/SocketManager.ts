import { Server } from "socket.io"; 

export default class SocketManager {
    public static handle(io: Server): void {
        io.on("connection", socket => {});
    }
}