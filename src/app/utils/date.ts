export function formatDay(day: number): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day] || 'Jour inconnu';
}

export function formatDate(value: number | string | Date): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    value = new Date(value);
  }
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(value: number | Date): string {
  if (typeof value === 'number') {
    value = new Date(value);
  }
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatBirthday(value: string | Date | number): string | null {
  if (!value) {
    return null;
  }

  let date: Date;
  if (typeof value === 'string') {
    date = new Date(value);
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else {
    date = value as Date;
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
  }).format(date);
}


export function toTimestamp(value: Date | string): number {
  if (typeof value === 'string') {
    value = new Date(value);
  }
  return Math.floor(value.getTime() / 1000);
}

export function toDate(value: Date | number | string): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date(0);
}

export function toInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${minutes}:${seconds}`;
}