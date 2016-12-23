const ClickClack = require('clickclack');

const watcher = new ClickClack({
  element: document.querySelector('.ta'),
  activeEvent: 'keypress',
  idleEvent: 'blur',
  idleDelay: 3000,
  busyDelay: 6000,
  blacklistedKeys: ['v', 'alt+m', 'shift+s', 'shift+s+d'],
});

watcher.on('active', () => {
  console.log('active');
});

watcher.on('idle', () => {
  console.log('idle');
});

watcher.on('busy', () => {
  console.log('busy');
});

