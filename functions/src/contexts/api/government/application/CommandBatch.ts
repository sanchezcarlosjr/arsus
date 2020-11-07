export interface Command {
    execute: (...dependency: any) => any;
}

export class CommandBatch {
    private static INSTANCE: CommandBatch;
    private constructor(private commands: Command[] = []) { }
    public static getInstance() {
        if (!CommandBatch.INSTANCE) {
            CommandBatch.INSTANCE = new CommandBatch();
        }
        return CommandBatch.INSTANCE;
    }
    public addCommand(command: Command) {
        this.commands.push(command);
        return this;
    }
    public execute(response: any): any {
        while (this.commands.length > 1) {
            this.commands.pop().execute(response);
        }
        return this.commands.pop().execute(response);
    }
}