export default class MockElement {
  constructor() {
    this.onInput = () => {};
    this.value = '';
    this.selectionStart = 0;
    this.setSelectionRange = jest.fn();
  }

  addEventListener(type, handler) {
    if (type === 'input') {
      this.onInput = handler;
    }
  }
}
