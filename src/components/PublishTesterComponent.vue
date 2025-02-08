<script setup lang="ts">
import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { ref, computed } from 'vue';
import type { TopicType } from '@/lib/roslibUtils/rosTypes';

// Define the message types
const messageTypes = [
  'std_msgs/Int32',
  'std_msgs/Bool',
  'std_msgs/String',
  'std_msgs/Char',
  'std_msgs/Float32',
  'std_msgs/Time',
  'sensor_msgs/msg/CompressedImage',
];

const topicNameInput = ref('');
const messageTypeInput = ref('');
const dataInput = ref('');
const customMessageType = ref('');
const receivedMessage = ref('');

const messageTypeID = computed(() => {
  let idx = messageTypes.indexOf(messageTypeInput.value);
  if (idx === -1) idx = messageTypes.length; // Custom input index
  return idx;
});

function convertMessage(topicType: string, message: string) {
  switch (topicType) {
    case 'std_msgs/Int32':
      return { data: parseInt(message) };
    case 'std_msgs/Bool':
      return { data: message.toLowerCase() === 'true' };
    case 'std_msgs/String':
      return { data: message };
    case 'std_msgs/Char':
      return { data: message.charAt(0) };
    case 'std_msgs/Float32':
      return { data: parseFloat(message) };
    case 'std_msgs/Time':
      return { data: new Date(message).toISOString() };
    case 'sensor_msgs/msg/CompressedImage':
      return { data: message }; // Assuming the message is a base64 encoded string
    default:
      return { data: message };
  }
}

function publishTest() {
  const topicName = topicNameInput.value;
  const topicType =
    messageTypeID.value === messageTypes.length ? customMessageType.value : messageTypeInput.value;
  const topicMessage = convertMessage(topicType, dataInput.value);

  if (topicName && topicType && topicMessage) {
    const testPublisher = createPublisher({
      topicName: topicName,
      topicType: topicType as TopicType,
    });

    const testSubscriber = createSubscriber({
      topicName: topicName,
      topicType: topicType as TopicType,
    });

    testSubscriber.start({
      callback: (message) => {
        receivedMessage.value = JSON.stringify(message);
      },
    });

    testPublisher.publish(topicMessage);
  } else {
    alert('Please fill in all fields.');
  }
}
</script>

<template>
  <div class="container">
    <h2>Test Publisher</h2>
    <form @submit.prevent="publishTest" id="publish-form" class="content">
      <div class="textfield">
        <label for="topic-name-input">Topic Name: </label>
        <input v-model="topicNameInput" type="text" id="topic-name-input" required />
      </div>

      <div class="textfield">
        <label for="message-type-input">Message Type: </label>
        <select v-model="messageTypeInput" id="message-type-input" required>
          <option v-for="messageType in messageTypes" :key="messageType" :value="messageType">
            {{ messageType }}
          </option>
          <option value="">Other</option>
        </select>
        <input
          v-if="messageTypeID === messageTypes.length"
          v-model="customMessageType"
          type="text"
          placeholder="Custom Message Type"
          required
        />
      </div>

      <div class="textfield">
        <label for="textfield-input">Data: </label>
        <input v-model="dataInput" type="text" id="textfield-input" required />
      </div>

      <div class="button-container">
        <div class="taking-space"></div>
        <button type="submit">Publish</button>
      </div>

      <div v-if="receivedMessage" class="subscriber-box">
        <h2>Received Message:</h2>
        <pre>{{ receivedMessage }}</pre>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
// .container {
//   display: flex;
//   flex-direction: column;
// }

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.textfield {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  max-width: 270px;
  width: 100%;
  flex-shrink: 1;
}

#message-type-input {
  width: 143px;
}

label {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 900;
  width: 120px;
  text-align: right;
}

input {
  flex: 1;
  height: 30px;
}

taking-space {
  margin-right: auto;
}

button {
  background-color: var(--correct);
  // margin-left: auto;
  flex-shrink: 0;
}

.subscriber-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid var(--light-grey);
  border-radius: 5px;
  background-color: var(--dark-grey);
  color: var(--white);
  width: 300px;
  max-height: 80px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
}
</style>
