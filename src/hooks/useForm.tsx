import type { ISerialized } from "../types";

export const useForm = () => {
    const serialize = (form: HTMLFormElement): ISerialized<string, FormDataEntryValue> => {
        const data = new FormData(form);
        const formData: ISerialized<string, FormDataEntryValue> = {};
        for (const [name, value] of data) {
            formData[name] = value;
        }
        return formData;
    }
    const serializeFiles = (form: HTMLFormElement): FormData => {
        return new FormData(form)
    }
  return {
    serialize,
    serializeFiles
  }
}
