import { EventEmitter } from 'events';
import throttle from 'lodash.throttle';
import Combokeys from 'combokeys';

const sec = (s) => s * 1000;
const contains = (arr, val) => arr.indexOf(val) > -1;
const isModifierKey = (k) => contains(['Alt', 'Shift', 'Control'], k);

module.exports = class ClickClack extends EventEmitter {
  constructor({
    element,
    idleDelay = sec(3),
    busyDelay = sec(10),
    activeEvent = 'keypress',
    idleEvent = 'blur',
    blacklistedKeys = [],
  }) {
    super();
    this.element = element;
    this.activeEvent = activeEvent;
    this.idleEvent = idleEvent;
    this.idleDelay = idleDelay;
    this.busyDelay = busyDelay;
    this.blacklistedKeys = blacklistedKeys.map(String);
    this.isBlacklistedKey = false;

    if (!(this.element instanceof window.HTMLElement)) {
      throw new TypeError('The element attribute supplied to the constructor must be of type HTMLElement');
    }

    this.addBlackListedKeyListeners();
    this.addInputListeners();
  }

  addInputListeners() {
    this.element.addEventListener(this.activeEvent, throttle((e) =>
      this.registerActivity(e), sec(0.5)));

    this.element.addEventListener(this.idleEvent, () => this.idle());
  }

  addBlackListedKeyListeners() {
    if (!this.blacklistedKeys.length) {
      return;
    }

    const combokeys = new Combokeys(this.element);
    combokeys.stopCallback = () => false;
    combokeys.bind(this.blacklistedKeys, () => this.isBlackListed());
  }

  reset() {
    clearTimeout(this.idleTimeout);
    clearTimeout(this.busyTimeout);
  }

  active() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.emit('active');
  }

  idle() {
    if (!this.isActive) {
      return;
    }

    this.reset();
    this.isActive = false;
    this.emit('idle');
  }

  busy() {
    this.emit('busy');
  }

  registerActivity(e) {
    if (this.isBlacklistedKey || isModifierKey(e.key)) {
      this.isBlacklistedKey = false;
      return;
    }

    this.registerExtendedActivity();
    this.active();
    clearTimeout(this.idleTimeout);

    this.idleTimeout = setTimeout(() => this.idle(), this.idleDelay);
  }

  registerExtendedActivity() {
    if (this.isActive) {
      return;
    }

    this.busyTimeout = setTimeout(() =>
      this.busy(), this.busyDelay);
  }

  isBlackListed() {
    this.isBlacklistedKey = true;
  }
};
