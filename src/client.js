import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { connectDb } from "./db-connector.js";
import "date-utils";

const ENDPONT_URL = 'http://elasticmq:9324';
const QUEUE_URL = `${ENDPONT_URL}/queue/greetings`;

const client = new SQSClient({
    endpoint: ENDPONT_URL,
});

const conn = await connectDb();

const fetchOneUnsentGreeting = async () => {
    const query = 'SELECT * FROM `greetings` WHERE `is_sent` = false LIMIT 1';
    const [ rows ] = await conn.execute(query);
    return rows?.[0];
};

const markGreetingAsSent = async (id) => {
    const query = 'UPDATE `greetings` SET `is_sent` = true, `sent_time` = ? WHERE `id` = ?';
    const [ rows ] = await conn.execute(query, [(new Date()).toFormat('YYYY-MM-DD HH24:MI:SS'), id]);
    return rows?.[0];
};

const send = async () => {
    const greeting = await fetchOneUnsentGreeting();
    if (!greeting) {
        console.log('All greetings already sent.');
        return;
    }
    const command = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: `${greeting.id}`,
    });
    const response = await client.send(command);
    console.log(response);
    await markGreetingAsSent(greeting.id);
};

await send().catch(() => console.error('Some error occured in client.'));
await conn.end();