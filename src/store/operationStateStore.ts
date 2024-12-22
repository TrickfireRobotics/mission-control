import { defineStore } from 'pinia';
import { ref } from 'vue';

export type OperationState = 'disabled' | 'teleoperation' | 'autonomous';


export const useOperationStateStore = defineStore('operationType', () => {

  const operationState = ref<OperationState>('disabled');
  function setOperationMode(status: OperationState) {
    operationState.value = status;
    alert(`Mode Changed: ${status}`);
  }
  // Return all state, getters and functions
  return {operationState, setOperationMode};
});
