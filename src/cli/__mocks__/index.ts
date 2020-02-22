export const cfg = {
  __data: {} as { [key: string]: any },
  get(key: string) {
    return this.__data[key];
  },
  set(values: any) {
    this.__data = { ...this.__data, ...values };
  }
};

export default function main() {}
