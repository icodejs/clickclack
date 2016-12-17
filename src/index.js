import clickclack from 'clickclack';

(function() {
  const textarea = document.querySelector('.ta');
  const watcher = clickclack(textarea, {
    onIdle: () => {},
    onActive: () => {}
  });
}());
