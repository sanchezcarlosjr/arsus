import * as functions from 'firebase-functions';

export const SatListWatcher = functions
    .runWith({
        timeoutSeconds: 500,
        memory: '2GB',
    })
    .pubsub.schedule('0 */6 * * *')
    .onRun(async (context: functions.EventContext) => {
        console.log('Hello world!');
    });
