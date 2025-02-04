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

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const customMessageType = ref('');
const receivedMessage = ref('');

const currentConnectionIdx = computed(() => {
  let idx = messageTypes.indexOf(input2.value);
  if (idx === -1) idx = messageTypes.length; // Custom input index
  return idx;
});

function publishTest() {
  const topicName = input1.value;
  const topicType = currentConnectionIdx.value === messageTypes.length ? customMessageType.value : input2.value;
  const topicMessage = input3.value;

  if (topicName && topicType && topicMessage) {
    const testPublisher = createPublisher({
      topicName: topicName,
      topicType: topicType as TopicType,
    });

    testPublisher.publish({
      data: topicMessage,
    });
    console.log("Published:", { topicName, topicType, data: topicMessage });

    const testSubscriber = createSubscriber({
      topicName: topicName,
      topicType: topicType as TopicType,
    });

    testSubscriber.start({
      callback: (message) => {
        receivedMessage.value = JSON.stringify(message);
      },
    });
  } else {
    alert("Please fill in all fields.");
  }
}
</script>

<template>
  <form @submit.prevent="publishTest" id="publish-form" class="content">
    <h1>Test Publisher</h1>

    <div class="textfield">
      <label for="topic-name-input">Topic Name: </label>
      <input v-model="input1" type="text" id="topic-name-input" required />
    </div>

    <div class="textfield">
      <label for="message-type-input">Message Type: </label>
      <select v-model="input2" id="message-type-input" required>
        <option v-for="messageType in messageTypes" :key="messageType" :value="messageType">
          {{ messageType }}
        </option>
        <option value="">Other</option>
      </select>
      <input v-if="currentConnectionIdx === messageTypes.length" v-model="customMessageType" type="text" placeholder="Custom Message Type" required />
    </div>

    <div class="textfield">
      <label for="textfield-input">Data: </label>
      <input v-model="input3" type="text" id="textfield-input" required />
    </div>
    <button type="submit">Publish</button>
  </form>

  <div v-if="receivedMessage" class="subscriber-box">
    <h2>Received Message:</h2>
    <pre>{{ receivedMessage }}</pre>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.textfield {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

#message-type-input {
  width: 140px;
}

label {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-weight: 900;
  width: 120px;
  text-align: right;
}

input {
  flex: 1; 
  height: 30px;
}

button {
  background-color: var(--correct);
  align-self: center;
}

.subscriber-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid var(--light-grey);
  border-radius: 5px;
  background-color: var(--dark-grey);
  color: var(--white);
  width: 100%;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>