import { EventEmitter } from 'events';

const inputMonitor = {
  ...EventEmitter.prototype,
  ...{
    setup({
      onIdle,
      onActive
    }) {
      this.on('idle', onIdle);
      this.on('active', onActive);
    },
    removeInputListener({
      onIdle,
      onActive
    }) {
      this.removeListener('idle', onIdle);
      this.removeListener('active', onActive);
    },
    active() {
      this.emit('active');
    },
    idle() {
      this.emit('idle');
    }
  }
};

export default (input, options) => {
  inputMonitor.setup(options);

  input.addEventListener('keyup', (e) => {
    console.log(e.type);
  });

  input.addEventListener('blur', (e) => {
    console.log(e.type);
  });
};
