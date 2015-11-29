import Ember from 'ember';

const {
  inject: { service },
  K,
  Mixin,
  get
} = Ember;
const { stringify } = JSON;

function now() {
  return window.performance.now();
}

export default Mixin.create({
  _startedRender: null,
  _finishedRender: null,

  lifecycleEvents: service('lifecycle/lifecycle-events'),

  init() {
    this._super(...arguments);
    if (!this.enableEventLogging) {
      this._logEvent = K;
      this._logRenderEvent = K;
    }
  },

  didInitAttrs(params) {
    this._logEvent('didInitAttrs', params);
  },

  didReceiveAttrs(params) {
    this._logEvent('didReceiveAttrs', params);
  },

  didUpdateAttrs(params) {
    this._logEvent('didUpdateAttrs', params);
  },

  didInsertElement() {
    this._logRenderEvent('didInsertElement');
  },

  willUpdate() {
    this._logRenderEvent('willUpdate', false);
  },

  willRender() {
    this._startedRender = now();
    this._logRenderEvent('willRender', false);
  },

  didUpdate() {
    this._logRenderEvent('didUpdate');
  },

  didRender() {
    this._logRenderEvent('didRender');
  },

  _logEvent(eventName, params) {
    get(this, 'lifecycleEvents.attrEvents').pushObject({
      eventName,
      params,
      id: this.elementId,
    });
  },

  _logRenderEvent(eventName, isTimed = true) {
    this._finishedRender = now();
    get(this, 'lifecycleEvents.renderEvents').pushObject({
      eventName,
      id: this.elementId,
      timing: isTimed ? this._finishedRender - this._startedRender : null
    });
  }
});
