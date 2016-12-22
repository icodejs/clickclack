import { EventEmitter } from 'events';
import throttle from 'lodash.throttle';

const sec = (s) => s * 1000;

module.exports = class ClickClack extends EventEmitter {
  constructor({
    element,
    idleDelay = sec(3),
    busyDelay = sec(10),
    activeEvent = 'keyup',
    idleEvent = 'blur',
  }) {
    super();
    this.element = element;
    this.activeEvent = activeEvent;
    this.idleEvent = idleEvent;
    this.idleDelay = idleDelay;
    this.busyDelay = busyDelay;
    this.addInputListeners();
  }

  addInputListeners() {
    if (!(this.element instanceof window.HTMLElement)) {
      throw new TypeError('ClickClack only accepts a HTMLElement');
    }

    this.element.addEventListener(this.activeEvent, throttle(() =>
      this.registerActivity(), sec(0.5)));

    this.element.addEventListener(this.idleEvent, () =>
      this.idle());
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

  registerActivity() {
    this.registerExtendedActivity();
    this.active();
    clearTimeout(this.idleTimeout);

    this.idleTimeout = setTimeout(() =>
      this.idle(), this.idleDelay);
  }

  registerExtendedActivity() {
    if (this.isActive) {
      return;
    }

    this.busyTimeout = setTimeout(() =>
      this.busy(), this.busyDelay);
  }
};
