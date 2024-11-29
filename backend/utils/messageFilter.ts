const personalInfoRegex = /(\b\d{10,11}\b)|(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;

export function filterPersonalInfo(message: string): string {
  return message.replace(personalInfoRegex, '***');
}

