const amqp = require('amqplib');
require('dotenv').config();

async function sendToQueue(queueName, message) {
  const connection = await amqp.connect(process.env.WORKER_QUEUE_URL); // Kết nối đến RabbitMQ server
  const channel = await connection.createChannel(); // Tạo một kênh

  await channel.assertQueue(queueName, { durable: false }); // Đảm bảo hàng đợi tồn tại
  channel.sendToQueue(queueName, Buffer.from(message)); // Gửi tin nhắn đến hàng đợi

  console.log(" [x] Sent %s", message);
  // setTimeout(() => {
  //   //connection.close(); // Đóng kết nối sau khi gửi tin nhắn
  // }, 2500);
}

module.exports = {
  sendToQueue,
}
