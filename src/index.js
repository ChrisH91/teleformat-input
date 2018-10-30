import teleformat from 'teleformat';

export const inputHandler = (value, prevValue, selectionStart) => {
  const lengthDifference = value.length - prevValue.length;
  const decorated = teleformat.decorate(value);

  if (decorated.international === '') {
    return { value, selectionStart };
  }

  const afterCharacter = value[selectionStart - 1];
  const isAfterLastCharacter = selectionStart === value.length;

  let nextSelectionStart = decorated.international.length;

  if (lengthDifference >= 0 && !isAfterLastCharacter) {
    for (let i = selectionStart - 1; i < decorated.international.length; i += 1) {
      if (decorated.international[i] === afterCharacter) {
        nextSelectionStart = i + 1;
        break;
      }
    }
  } else if (lengthDifference < 0) {
    for (let i = selectionStart; i >= 0; i -= 1) {
      if (decorated.international[i] === afterCharacter) {
        nextSelectionStart = i + 1;
        break;
      }
    }
  }

  return {
    value: decorated.international,
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
