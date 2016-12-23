import ClickClack from 'clickclack';
import { spy, stub, useFakeTimers } from 'sinon';

let clickclack;
let clock;
let activeSpy;
let idleSpy;
let busySpy;
let eventEmitterStub;
let activeEvent = 'keypress';
let idleDelay = 3000;
let busyDelay = 6000;
let blacklistedKeys = ['v', 'f'];


const typeCharacter = (el, char = 'c', altKey = false) => {
  let event = document.createEvent('Event');
  if (event.initEvent) {
    event.initEvent('keypress', true, true);
  }

  event.keyCode = char.toUpperCase().charCodeAt(0);
  event.which = char.toUpperCase().charCodeAt(0);
  event.key = char;
  event.altKey = altKey;
  el.dispatchEvent(event);
};

const simulateActivity = (el) => {
  const cl = useFakeTimers();
  for (let i = 0; i < busyDelay / 1000; i++) {
    typeCharacter(el);
    cl.tick(1000);
  }
};

const createInstance = (options = {}) => {
  const element = document.createElement('input');
  const defaults = {
    element,
    idleDelay,
    busyDelay,
    activeEvent,
    blacklistedKeys,
  };
  clickclack = new ClickClack({ ...defaults, ...options });

  activeSpy = spy();
  idleSpy = spy();
  busySpy = spy();
  clock = useFakeTimers();

  clickclack.on('active', activeSpy);
  clickclack.on('idle', idleSpy);
  clickclack.on('busy', busySpy);

  return element;
};


describe('ClickClack', () => {
  it('calls supplied "active" listener when specified event is fired', () => {
    const element = createInstance();

    typeCharacter(element);
    expect(activeSpy).to.have.been.called;
  });

  it('fires the "ative" event when specified event is fired', () => {
    const element = createInstance();

    eventEmitterStub = stub(clickclack, 'emit');
    typeCharacter(element);
    expect(eventEmitterStub).to.have.been.calledWith('active');
    eventEmitterStub.restore();
  });

  it('calls supplied "idle" listener when specified event is fired after (n) period of inactivity', () => {
    const element = createInstance();

    typeCharacter(element);
    expect(activeSpy).to.have.been.called;

    clock.tick(idleDelay);
    expect(idleSpy).to.have.been.called;
  });

  it('fires the "idle" event when  specified event is fired after (n) period of inactivity', () => {
    const element = createInstance();

    eventEmitterStub = stub(clickclack, 'emit');

    typeCharacter(element);
    clock.tick(idleDelay);

    expect(eventEmitterStub).to.have.been.calledWith('idle');
    eventEmitterStub.restore();
  });

  it('calls supplied "busy" listener after (n) period of activity', () => {
    const element = createInstance();

    simulateActivity(element);
    expect(busySpy).to.have.been.called;
  });

  it('fires the "busy" event after (n) period of activity', () => {
    const element = createInstance();

    eventEmitterStub = stub(clickclack, 'emit');
    simulateActivity(element);

    expect(eventEmitterStub).to.have.been.calledWith('busy');
    eventEmitterStub.restore();
  });

  it('throws an execption when a non HTMLElement is supplied', () => {
    const throwError = () => {
      new ClickClack({
        ...{
          element: document.createElement('input'),
          idleDelay,
          busyDelay,
          activeEvent,
          blacklistedKeys,
        },
        ...{ element: null }
      });
    };
    expect(throwError).to.throw(TypeError);
  });

  it('removes event listener when instructed', () => {
    const element = createInstance();

    typeCharacter(element);
    expect(activeSpy).to.have.been.called;

    clickclack.removeListener('active', activeSpy);
    clock.tick(idleDelay);

    typeCharacter(element);
    expect(activeSpy).to.have.been.calledOnce;
  });

  it('doesn\'t register activity for black listed characters', () => {
    const element = createInstance({ blacklistedKeys: ['v', 'c'] });
    typeCharacter(element);
    expect(activeSpy).to.not.have.been.called;
  });

  it('doesn\'t register activity for black listed characters combinations', () => {
    const element = createInstance({ blacklistedKeys: ['v', 'alt+v'] });
    typeCharacter(element, 'v', true);
    expect(activeSpy).to.not.have.been.called;
  });

  afterEach(function() {
    clock.restore();
    activeSpy.reset();
    idleSpy.reset();
    busySpy.reset();
  });
});
