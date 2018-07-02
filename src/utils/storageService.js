const setObject = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))

const getObject = key => {
  const value = localStorage.getItem(key)
  return (value && JSON.parse(value)) || undefined
}

const isSupported = () => typeof Storage !== 'undefined'

export default { setObject, getObject, isSupported }
