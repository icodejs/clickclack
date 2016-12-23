import ClickClack from 'clickclack';
import { spy, stub, useFakeTimers } from 'sinon';

describe('ClickClack', () => {
  let
    element,
    cc,
    clock,
    event,
    activeSpy,
    idleSpy,
    busySpy,
    args,
    eventEmitterStub,
    simulateActivity,
    typeCharacter,
    idleDelay = 3000,
    busyDelay = 6000;

  beforeEach(function() {
    element = document.createElement('textarea');
    args = { element, idleDelay, busyDelay };
    cc = new ClickClack(args);
    event = new window.KeyboardEvent('keyup', { code: 67 });

    activeSpy = spy();
    idleSpy = spy();
    busySpy = spy();
    clock = useFakeTimers();

    typeCharacter = () => element.dispatchEvent(event);
    simulateActivity = () => {
      for (let i = 0; i < busyDelay / 1000; i++) {
        typeCharacter();
        clock.tick(1000);
      }
    };

    cc.on('active', activeSpy);
    cc.on('idle', idleSpy);
    cc.on('busy', busySpy);
  });

  it('calls our "active" listener when our specified event is fired', () => {
    typeCharacter();
    expect(activeSpy).to.have.been.called;
  });

  it('fires the "ative" event when our specified event is fired', () => {
    eventEmitterStub = stub(cc, 'emit');
    typeCharacter();
    expect(eventEmitterStub).to.have.been.calledWith('active');
    eventEmitterStub.restore();
  });

  it('calls our "idle" listener when specified event is fired after (n) period of inactivity', () => {
    typeCharacter();
    expect(activeSpy).to.have.been.called;

    clock.tick(idleDelay);
    expect(idleSpy).to.have.been.called;
  });

  it('fires the "idle" event when our specified event is fired after (n) period of inactivity', () => {
    eventEmitterStub = stub(cc, 'emit');

    typeCharacter();
    clock.tick(idleDelay);

    expect(eventEmitterStub).to.have.been.calledWith('idle');
    eventEmitterStub.restore();
  });

  it('calls our "busy" listener after (n) period of activity', () => {
    simulateActivity();
    expect(busySpy).to.have.been.called;
  });

  it('fires the "busy" event after (n) period of activity', () => {
    eventEmitterStub = stub(cc, 'emit');
    simulateActivity();

    expect(eventEmitterStub).to.have.been.calledWith('busy');
    eventEmitterStub.restore();
  });

  it('throws an execption when a non HTMLElement is supplied', () => {
    const throwError = () => {
      new ClickClack({
        ...args,
        ...{ element: {} }
      });
    };
    expect(throwError).to.throw(TypeError);
  });

  it('removes event listener when instructed', () => {
    typeCharacter();
    expect(activeSpy).to.have.been.called;

    cc.removeListener('active', activeSpy);
    clock.tick(idleDelay);

    typeCharacter();
    expect(activeSpy).to.have.been.calledOnce;
  });

  afterEach(function() {
    clock.restore();
    activeSpy.reset();
    idleSpy.reset();
    busySpy.reset();
  });
});
