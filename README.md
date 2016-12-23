# Click Clack
![clickclack](media/clickclack.gif)

## About

The motivation for this module was to provide a mechanism for monitoring how a user might interact with an input text box, and fire events when the user transitions from idle to active to busy.

The intention was to use it within a video annotation web application called <a href="https://docuevid.com" target="_blank">Docuevid</a>, to decide whether or not to pause, start or slow down a video based on a users activity, thus aiding the annotation process.

## Getting Started
Install ClickClack as an npm module and save it to your package.json file as a dependency:

```
$ npm install clickclack --save
```

## Usage
The ClickClack constructor accepts an object containing five keys. The `element` key is the only one that is mandatory, and must be of the type HTMLElement. The rest are optional and will fall-back to the defaults specified in the API documentation below.

ClickClack extends the EventEmitter so you'll have a familiar Pub/Sub API for listening and responding to events.


```javascript
const ClickClack = require('clickclack');

const textarea = document.querySelector('.textarea');

const watcher = new ClickClack({
  element: textarea,
  activeEvent: 'keypress',
  idleEvent: 'blur',
  idleDelay: 3000,
  busyDelay: 6000
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
```


## API

### ClickClack([options])

#### element

Type: `HTMLElement`

HTMLElement that will be monitored for user interactions.


#### activeEvent

Type: `string`

Default: `keypress`

HTMLElement event that will define user activity.


#### idleEvent

Type: `string`

Default: `blur`

HTMLElement event that will define user inactivity.


#### idleDelay

Type: `number` *(milliseconds)*

Default: `3000`

Duration of inactivity needed, after being active, to fire an idle event.


#### busyDelay

Type: `number` *(milliseconds)*

Default: `6000`

Duration of activity needed to fire a busy event.

## License

MIT © [icodejs ltd](https://icodejs.com)
