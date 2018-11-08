import teleformatInput, { inputHandler } from '../src/index';
import MockElement from './mock-element';

describe('teleformat-input', () => {
  describe('inputHandler', () => {
    test('works for single +', () => {
      expect(inputHandler('+', '', 1).value).toBe('+');
    });

    test('doesnt decorate for unknown countries', () => {
      expect(inputHandler('+9991', '', 0).value).toBe('+9991');
    });

    test('decorates phone number', () => {
      expect(inputHandler('+15551', '', 0).value).toBe('+1 (555) 1');
      expect(inputHandler('+1 (555)1', '', 0).value).toBe('+1 (555) 1');
    });

    describe('caret position', () => {
      test('add single end of string', () => {
        expect(inputHandler('+1 (555) 1', '+1 (555) ', 10).selectionStart).toBe(10);
        expect(inputHandler('+1 (555)1', '+1 (555) ', 10).selectionStart).toBe(10);
        expect(inputHandler('+440', '+44', 4).selectionStart).toBe(8);
      });

      test('add single middle of string', () => {
        expect(inputHandler('+1 (5155) 1', '+1 (555) 1', 6).selectionStart).toBe(6);
        expect(inputHandler('+1 (5551) ', '+1 (555) ', 8).selectionStart).toBe(10);
        expect(inputHandler('+447545', '+47545', 2).selectionStart).toBe(2);
      });

      test('add range end of string', () => {
        expect(inputHandler('+1 (555) 1234567', '+1 (555) ', 16).selectionStart).toBe(17);
        expect(inputHandler('+445555666666', '+4', 13).selectionStart).toBe(19);
      });

      test('add range middle of string', () => {
        expect(inputHandler('+1 (5678955) ', '+1 (555) ', 9).selectionStart).toBe(11);
        expect(inputHandler('+44756898', '+456898', 4).selectionStart).toBe(9);
      });

      test('remove single end of string', () => {
        expect(inputHandler('+1 (555) 1', '+1 (555) 12', 10).selectionStart).toBe(10);
        expect(inputHandler('+1 (555) ', '+1 (555) 1', 9).selectionStart).toBe(9);
        expect(inputHandler('+1 (55) ', '+1 (555) ', 6).selectionStart).toBe(5);
        expect(inputHandler('+1 (555 ', '+1 (555) ', 7).selectionStart).toBe(7);
      });

      test('remove single middle of string', () => {
        expect(inputHandler('+1 (55) 1', '+1 (555) 1', 6).selectionStart).toBe(6);
        expect(inputHandler('+44 (0) 1387 2', '+44 (0) 1387 21', 14).selectionStart).toBe(14);
      });

      test('remove range end of string', () => {
        expect(inputHandler('+1 (5', '+1 (555) 1', 5).selectionStart).toBe(4);
      });

      test('remove range middle of string', () => {
        expect(inputHandler('+1 () 1234', '+1 (555) 1234', 4).selectionStart).toBe(4);
        expect(inputHandler('+61 (066', '+61 (02) 666', 8).selectionStart).toBe(7);
      });
    });
  });

  test('formats on input', () => {
    const el = new MockElement();
    teleformatInput(el);

    el.value = '+1415555';
    el.onInput();
    expect(el.value).toBe('+1 (415) 555-');
  });

  test('sets caret position on input', () => {
    const el = new MockElement();
    teleformatInput(el);

    el.value = '+44';
    el.onInput();

    el.value = '+440';
    el.selectionStart = 7;
    el.onInput();

    expect(el.setSelectionRange).toBeCalledWith(8, 8);
  });
});
