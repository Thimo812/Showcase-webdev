
export default class SignalRHandler {

    connection;
    
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7241/game-hub", {
                accessTokenFactory: () => localStorage.getItem("bearer-token")
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    async start() {
        try {
            await this.connection.start();
            console.log("SignalR connected");
        } catch (err) {
            console.log(err);
        }
    }

    applyEventListeners() {
        this.connection.onclose(async () => {
            await this.start();
        })

        this.connection.on("GameEnded", (data) => {

        });

        this.connection.on("UpdateBoard", (data) => {

        });

        this.connection.on("GameStarted", (data) => {
            
        });

        this.connection.on("InvalidWord", (data) => {
            
        });
    }

    async findGame() {
        return await this.sendMessage("FindGame", localStorage.getItem("username"));
    }

    async cancelFindGame() {
        await this.connection.invoke("CancelFindGame").then(() => {
            return true;
        }).catch((err) => {
            return false;
        });
    }

    async guessWord(word) {
        return await this.sendMessage("GuessWord", word);
    }

    async sendMessage(methodName, message) {
        await this.connection.invoke(methodName, message).then(() => {
            return true;
        }).catch((err) => {
            return false;
        });
    }
}