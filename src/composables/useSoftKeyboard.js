import { ref } from 'vue'

const kbOpen = ref(false)
const activeId = ref('')
const hint = ref('')
const isUpperCase = ref(false)

let readValue = () => ''
let writeValue = () => {}
let ignoreUntil = 0

export function useSoftKeyboard() {
  function open({ id, hint: nextHint, get, set }) {
    activeId.value = id
    hint.value = nextHint
    readValue = get
    writeValue = set
    kbOpen.value = true
    ignoreUntil = Date.now() + 400
  }

  function hide() {
    kbOpen.value = false
    activeId.value = ''
  }

  function insertChar(char) {
    writeValue(`${readValue() ?? ''}${char}`)
  }

  function backspace() {
    writeValue(String(readValue() ?? '').slice(0, -1))
  }

  function shouldIgnoreDocClick() {
    return Date.now() < ignoreUntil
  }

  return {
    kbOpen,
    activeId,
    hint,
    isUpperCase,
    numbers: '1234567890.'.split(''),
    letterRows: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
    open,
    hide,
    insertChar,
    backspace,
    shouldIgnoreDocClick
  }
}
