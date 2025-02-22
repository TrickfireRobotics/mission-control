import { defineStore } from 'pinia';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';

export type OperationState = 'disabled' | 'teleoperation' | 'autonomous';

export const useOperationStateStore = defineStore('operationType', () => {
  const operationStatePub = createPublisher({
    topicName: '/setOperationState',
    topicType: 'std_msgs/String',
  });

  const operationStateSub = createSubscriber({
    topicName: '/setOperationState',
    topicType: 'std_msgs/String',
    startingDefaultValue: { data: 'disabled' },
  });

  /**
   * This function publishes to the /setOperationState topic to change the operation state.
   * @param state - the new operation state to set the driver to.
   */
  function setOperationState(state: { data: OperationState }) {
    operationStatePub.publish(state);
  }
  /**
   * This function returns the current operation state.
   */
  function getOperationState() {
    return operationStateSub.msg?.value?.data;
  }

  // Return all state, getters and functions
  return { operationStateSub, setOperationState, getOperationState };
});
