export function search<T>(object: T, properties: Array<keyof T>, query: string): boolean {
  if (query === "") {
    return true;
  }

  return properties.some((prop) => {
    const value = object[prop];
    if (typeof value === "string" || typeof value === "number") {
      return value.toString().toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
}

// this is a linear search
