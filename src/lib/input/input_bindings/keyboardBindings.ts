import type { KeyboardBind } from './bindingTypes';

function Say(str: string, times: number) {
  console.log(str.repeat(times));
}

function SayStuff() {
  console.log('Stuff!');
}

/*
 * This file contains the keyboard bindings for the input system.
 * Each keyboard instance has its own set of profiles that set the bindings for the keys.
 * The outermost array corresponds to the keyboard index, and each inner array contains the binding profiles for that keyboard.
 *
 * The keys in each binding object correspond to the key names, and the values can be:
 * - A string representing a publisher name:
 *       The input system will create a publisher for that topic and publish the key state.
 * - A function to be called
 *       The input system will call this function when the key is pressed.
 * - An object with a function and optional arguments
 *       The input system will call the function with the provided arguments when the key is pressed.
 */
const keyboardBindings: { [input: string]: KeyboardBind }[] = [
  {
    a: 'gripRotOpen',
    b: '',
    c: '',
    d: '',
    e: '',
    f: '',
    g: '',
    h: '',
    i: '',
    j: '',
    k: '',
    l: '',
    m: '',
    n: '',
    o: '',
    p: '',
    q: '',
    r: '',
    s: '',
    t: '',
    u: '',
    v: '',
    w: '',
    x: '',
    y: '',
    z: '',
    '0': SayStuff,
    '1': SayStuff,
    '2': { function: SayStuff },
    '3': { function: Say, args: ['Hello', 3] },
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    Enter: '',
    Escape: '',
    Backspace: '',
    Tab: '',
    Shift: '',
    Control: '',
    Alt: '',
    CapsLock: '',
    ArrowUp: '',
    ArrowDown: '',
    ArrowLeft: 'move_left_drivebase_side_message',
    ArrowRight: 'move_right_drivebase_side_message',
    ' ': '',
  },
  {
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: '',
    g: '',
    h: '',
    i: '',
    j: '',
    k: '',
    l: '',
    m: '',
    n: '',
    o: '',
    p: '',
    q: '',
    r: '',
    s: '',
    t: '',
    u: '',
    v: '',
    w: '',
    x: '',
    y: '',
    z: '',
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    Enter: '',
    Escape: '',
    Backspace: '',
    Tab: '',
    Shift: '',
    Control: '',
    Alt: '',
    CapsLock: '',
    ArrowUp: '',
    ArrowDown: '',
    ArrowLeft: '',
    ArrowRight: '',
    ' ': '',
  },
];

export default keyboardBindings;
