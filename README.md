Thebot
=============

### Philosophy

- **Simple**
- **Intuitive**
- **Extensible**
    - Various channels (Slack, KakaoTalk, Line, Console, REST API ...)
    - Various parsers (Regex, LUIS, Koin, ...)
    - i18n support
    - Each component is decoupled, so it's easily Testable
- Scalable
    - Multiple clients

 고려해야 할 사항:
 - 다양한 채널별 이벤트들 (ex: Slack에서의 Keyboard Typing)


##### Develoment Notes

```
Channel --->  Bot.incoming  ---\
                                ----> IntentHandler ----->  Bot.outcoming ---> Channel
 Channel ---> Context ---------/


[Start conversation]
1. Channel listens message
2. Bot finds context with unique information from channel.
    2.1. Nothing has been found.
3. Bot creates context.
4. Bot.incoming parses intent and adds it to the message.
5. Bot handles intent with according handler.

[Message in Conversation]
1. Channel listens message
2. Bot finds context with unique information from channel.
    2.1. Found existing context.
3. Bot.incoming parses intent and adds it to the message.
4. Context.answerPromise (DeferredPromise) will be resolved and handler (which is a coroutine) will be resumed.
```

## License: MIT