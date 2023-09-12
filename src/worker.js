import {
    ReceiveMessageCommand,
    DeleteMessageCommand,
    SQSClient,
} from "@aws-sdk/client-sqs";
import { connectDb } from "./db-connector.js";
import { setTimeout } from "timers/promises";
import "date-utils";

const ENDPONT_URL = 'http://elasticmq:9324';
const QUEUE_URL = `${ENDPONT_URL}/queue/greetings`;

const client = new SQSClient({
    endpoint: ENDPONT_URL,
});

const conn = await connectDb();

const findGreetingById = async (id) => {
    const query = 'SELECT * FROM `greetings` WHERE `id` = ?';
    const [ rows ] = await conn.execute(query, [id]);
    return rows?.[0];
};

const markGreetingAsReceived = async (id) => {
    const query = 'UPDATE `greetings` SET `is_received` = true, `received_time` = ? WHERE `id` = ?';
    const [ rows ] = await conn.execute(query, [(new Date()).toFormat('YYYY-MM-DD HH24:MI:SS'), id]);
    return rows?.[0];
};

const receive = async () => {
    // メッセージ受信
    const receiveMessageCommand = new ReceiveMessageCommand({
        MaxNumberOfMessages: 1,
        QueueUrl: QUEUE_URL,
        WaitTimeSeconds: 20,
    });
    const { Messages } = await client.send(receiveMessageCommand);
    const message = Messages?.[0];
    if (!message) {
        return;
    }
    const greeting = await findGreetingById(Number(message.Body));
    console.log(greeting.content);
    // レコード更新
    await markGreetingAsReceived(greeting.id);
    // メッセージ削除
    const deleteMessageCommand = new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
    });
    await client.send(deleteMessageCommand);
};

while (true) {
    await receive().catch(() => console.error('Some error occured in worker.'));
    await setTimeout(3000);
}