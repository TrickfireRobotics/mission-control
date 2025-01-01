import { defineStore } from 'pinia';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { ref } from 'vue';

export type OperationState = 'disabled' | 'teleoperation' | 'autonomous';

export const useOperationStateStore = defineStore('operationType', () => {
  const operationStatePublisher = createPublisher({
    topicName: '/setOperationState',
    topicType: 'std_msgs/String',
  });
  const operationState = ref<OperationState>('disabled');

  // Sets the operation state to the specified state and sends out a message on the ros topic to change the state.
  function setOperationState(state: OperationState) {
    operationState.value = 'autonomous';
    operationStatePublisher.publish({ data: operationState.value });
  }

  // Return all state, getters and functions
  return { operationState, setOperationState };
});
