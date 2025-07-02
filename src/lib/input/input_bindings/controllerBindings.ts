import { type ControllerBind } from './bindingTypes';

/*
 * This file contains the controller bindings for the input system.
 * Each controller instance has its own set of profiles that set the bindings for the buttons and axes.
 * The outermost array corresponds to the controller index, and each inner array contains the binding profiles for that controller.
 *
 * The keys in each binding object correspond to the button names, and the values can be:
 * - A string representing a publisher name:
 *       The input system will create a publisher for that topic and publish the button state.
 * - A function to be called
 *       The input system will call this function when the button is pressed and released.
 * - An object with a function and optional arguments
 *       The input system will call the function with the provided arguments when the button is pressed and released.
 */
export const ControllerInstanceProfiles: { [input: string]: ControllerBind }[][] = [[{}], [{}]];
