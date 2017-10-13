
class EventEmitter {}

interface Context {
    i: Myself;
    bot: Bot;
    user: User;
    channel: Channel;
    messages: Message[];
    startedAt: Date;
    roundTripCount: number;

    // unique info (chat room ID, user ID, etc...) about conversation to identify a Context. provided by Channel.
    uniqueInfo: object;

    // An intent of the conversation.
    intent: string;
    entities: object;
    userMessagePromise: DeferredPromise<Message>;
}

class DeferredPromise<T> extends Promise<T> {
    resolve(...args: any[]);
    reject(...args: any[]);
}

class Myself {
    speak(message: (Message | string), to?: User): Promise<boolean>;
    ask(question: (Message | string), to?: User): Promise<string>;
    listen(to?: User): Promise<string>;
    closeDialogue(): Promise;
}

interface User {
    id: string;
    info: object;
    memory: object;
}

type Handler = (context: Context) => Promise;

class Middlewares<T> {
    use(middleware: T);
    use(middlewares: T[]);

    handle(...args: any[]);
}

class Bot extends Middlewares<Handler> {

    incoming: Middlewares<Handler>;
    outgoing: Middlewares<Handler>;

    when(intent: string, handler: Handler);
    sendIntent(intent: string, entities: object);

    // TODO: Context store가 아니라 start Conversation을 봇에서 하는게 옳은가?
    // TODO: context store를 Memory로 분리.
    canStartConversation(message: Message);
    startConversation(channel: Channel, message: Message);
    findContext(message: Message): Context;
    hasContext(message: Message): Context;
}

class Message {
    text: string;
    intent?: string;
    entities?: object;

    static fromRaw(text: string, additionalInfo: object);
}

interface Channel extends EventEmitter, Middlewares<Handler> {
    send(message: string, to?: string): Promise;
    start(bot: Bot);

    isMentioned(bot: Bot, message: Message);
}


