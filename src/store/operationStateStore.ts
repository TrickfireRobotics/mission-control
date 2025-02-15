import { defineStore } from 'pinia';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { ref } from 'vue';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';

export type OperationState = 'disabled' | 'teleoperation' | 'autonomous';

export const useOperationStateStore = defineStore('operationType', () => {
  const operationStatePublisher = createPublisher({
    topicName: '/setOperationState',
    topicType: 'std_msgs/String',
  });

  const operationState = createSubscriber({
    topicName: '/setOperationState',
    topicType: 'std_msgs/String',
    startingDefaultValue: { data: 'disabled' },
  });

  /**
   * This function sets the operation state to the specified state and sends out a message on the ros topic to change the state.
   * @param state - the new operation state to set the driver to.
   */
  function setOperationState(state: { data: OperationState }) {
    operationStatePublisher.publish(state);
  }

  // Return all state, getters and functions
  return { operationState, setOperationState };
});
