const amqp = require('amqplib');
const axios = require('axios');
const { FetchDataModel } = require('../models/fetchDataModel');
require('dotenv').config();

async function startWorker(queueName) {
    console.log("hello receipt queue");
    const connection = await amqp.connect(process.env.WORKER_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    console.log(`Worker is waiting for messages in queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            if (queueName === 'fetchData') {

                console.log(`Received message: ${msg.content.toString()}`);

                // Phân tích chuỗi JSON nhận được thành một đối tượng JavaScript
                const msgObject = JSON.parse(msg.content.toString());

                // Sử dụng đối tượng để tạo một instance của FetchDataModel
                const fetchData = new FetchDataModel(msgObject.baseUrl, msgObject.method, msgObject.data, msgObject.headers);

                console.log(`Processing FetchDataModel: ${fetchData.baseUrl}, ${fetchData.method}`);

                // Thực hiện gọi API sử dụng axios với thông tin từ fetchData
                try {
                    const response = await axios({
                        method: fetchData.method,
                        url: fetchData.baseUrl,
                        data: fetchData.data,
                        headers: fetchData.headers
                    });
                    console.log(`API Response: ${response.status} ${response.statusText}`);
                    // Xử lý phản hồi từ API tại đây
                } catch (error) {
                    console.error(`Error calling API: ${error.message}`);
                    // Xử lý lỗi tại đây
                }
            }else if(queueName === 'createOdooAndDNS'){
                //get company => companyid trong mongo
                //tạo dns 
                //gắn subdomain cho odoo đê tạo db    
                //cập nhật apikeycompany
            }
            channel.ack(msg); // Acknowledge the message
        }
    });
}

startWorker("fetchData");
startWorker("createOdooAndDNS");