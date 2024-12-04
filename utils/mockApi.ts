export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export interface FormConfig {
  fields: FormField[];
}

const formConfigs: Record<string, FormConfig> = {
  userInfo: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

export const mockApi = async (formType: string): Promise<FormConfig> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const config = formConfigs[formType];
      if (config) {
        resolve(config);
      } else {
        reject(new Error("Invalid form type"));
      }
    }, 500);
  });
};

