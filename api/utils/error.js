export const errorHandler = (statusCode, message) => {
  const error = new Error()
  error.statusCode = statusCode
  error.message = message
  return error
}

export const generateRandomPassword = () =>
  Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

export const getRandomName = () =>  Math.random().toString(9).slice(-4)
