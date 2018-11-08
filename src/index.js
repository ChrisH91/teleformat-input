import teleformat from 'teleformat';

export const inputHandler = (value, prevValue, selectionStart, countryCode) => {
  const normalizedValue = value.trimLeft();

  const lengthDifference = normalizedValue.length - prevValue.length;
  const decorated = teleformat.decorate(normalizedValue, countryCode);

  if (decorated.international === '') {
    return {
      normalizedValue,
      selectionStart,
      number: [],
    };
  }

  const afterCharacter = normalizedValue[selectionStart - 1];
  const isAfterLastCharacter = selectionStart === normalizedValue.length;

  const nextValue = normalizedValue.charAt(0) === '+' ? decorated.international : decorated.local;

  let nextSelectionStart = decorated.international.length;

  if (lengthDifference >= 0 && !isAfterLastCharacter) {
    for (let i = selectionStart - 1; i < nextValue.length; i += 1) {
      if (nextValue[i] === afterCharacter) {
        nextSelectionStart = i + 1;
        break;
      }
    }
  } else if (lengthDifference < 0) {
    for (let i = selectionStart; i >= 0; i -= 1) {
      if (nextValue[i] === afterCharacter) {
        nextSelectionStart = i + 1;
        break;
      }
    }
  }

  return {
    value: nextValue,
    number: decorated,
    selectionStart: nextSelectionStart,
  };
};

export default (element) => {
  let current = element.value;

  const onInput = () => {
    const nextState = inputHandler(element.value, current, element.selectionStart);

    element.value = nextState.value; // eslint-disable-line no-param-reassign
    element.setSelectionRange(nextState.selectionStart, nextState.selectionStart);

    current = nextState.value;
  };

  onInput();
  element.addEventListener('input', onInput);
};
